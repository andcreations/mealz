import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { 
  BOOTSTRAP_CONTEXT,
  Context,
  generateCorrelationId,
} from '@mealz/backend-core';
import { 
  createTranslation,
  getStrEnv,
  minutesToMs,
  randomKeyByPrefix,
  resolveTimeZone,
  lastMidnight,
  todayRange,
  TranslateFunc,
} from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import { UserWithoutPassword } from '@mealz/backend-users-common';
import { UsersCrudTransporter } from '@mealz/backend-users-crud-service-api';
import { 
  UsersNotificationsTransporter,
} from '@mealz/backend-users-notifications-service-api';
import { 
  HydrationDailyPlan,
  HydrationDailyPlanReminderEntry,
  HydrationDailyPlanTransporter,
} from '@mealz/backend-hydration-daily-plan-service-api';
import { 
  HydrationLog,
  HydrationLogTransporter,
} from '@mealz/backend-hydration-log-service-api';
import { sumGlassFractions } from '@mealz/backend-hydration-log-gateway-api';
import { 
  HydrationReminderServiceTranslations,
} from './HydrationReminderService.translations';

@Injectable()
export class HydrationReminderService implements OnModuleInit {
  private static readonly DEFAULT_CRON = '*/5 * * * *';
  private static readonly JOB_NAME = 'hydration-reminder';

  private job: CronJob | undefined = undefined;
  private lastJobTime = Date.now();
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly usersCrudTransporter: UsersCrudTransporter,
    private readonly usersNotificationsTransporter:
      UsersNotificationsTransporter,
    private readonly hydrationDailyPlanTransporter:
      HydrationDailyPlanTransporter,
    private hydrationLogTransporter: HydrationLogTransporter,
  ) {
    this.translate = createTranslation(HydrationReminderServiceTranslations);
  }

  public async onModuleInit(): Promise<void> {
    const context = BOOTSTRAP_CONTEXT;

    // create job
    const cronExpression = getStrEnv(
      'MEALZ_HYDRATION_REMINDER_CRON',
      HydrationReminderService.DEFAULT_CRON,
    );
    this.job = new CronJob(
      cronExpression,
      () => { this.generateReminders(); },
      undefined,
      undefined,
      resolveTimeZone(),
    );

    // schedule the job
    this.logger.info('Scheduling hydration reminders generation', {
      ...context,
      cronExpression,
    });
    this.schedulerRegistry.addCronJob(
      HydrationReminderService.JOB_NAME,
      this.job,
    );
    this.job.start();
  }

  private async generateReminders(): Promise<void> {
    const context: Context = {
      correlationId: generateCorrelationId(HydrationReminderService.JOB_NAME),
    }
  
    const now = DateTime.now().setZone(resolveTimeZone());
    let lastId: string | undefined = undefined;
    const limit = 100;

    try {
      // loop until all users are processed
      while (true) {
        // read users
        const { users } = await this.usersCrudTransporter.readUsersFromLastV1(
          { lastId, limit },
          context,
        );

        // generate reminders
        for (const user of users) {
          await this.generateRemindersForUser(
            user,
            now,
            this.lastJobTime,
            now.toMillis(),
            context,
          );
        }

        // more
        if (users.length < limit) {
          break;
        }
        lastId = users[users.length - 1].id;
      }
    } finally {
      this.lastJobTime = now.toMillis();
    }
  }

  private async generateRemindersForUser(
    user: UserWithoutPassword,
    now: DateTime,
    timeStart: number,
    timeEnd: number,
    context: Context,
  ): Promise<void> {
    // check if we can send messages to the user
    const {
      canSendMessagesTo,
    } = await this.usersNotificationsTransporter.readUserNotificationsInfoV1(
      { userId: user.id },
      context,
    );
    if (!canSendMessagesTo) {
      this.logger.debug(
        'Cannot send messages to user, skipping hydration reminders', 
        {
          ...context,
          userId: user.id,
        },
      );
      return;
    }

    // read daily plan
    const {
      hydrationDailyPlan,
    } = await this.hydrationDailyPlanTransporter.readCurrentHydrationDailyPlanV1(
      { userId: user.id },
      context,
    );
    if (!hydrationDailyPlan) {
      this.logger.debug(
        'No hydration daily plan found, skipping hydration reminders',
        {
          ...context,
          userId: user.id,
        },
      );
      return;
    }

    // logs
    const todaysHydrationLogs = await this.readUserTodaysHydrationLogs(
      user.id,
      context,
    );

    // should send reminder
    const shouldSendReminder = this.shouldSendReminder(
      user.id,
      now,
      timeStart,
      timeEnd,
      hydrationDailyPlan,
      todaysHydrationLogs,
      context,
    );
    if (!shouldSendReminder) {
      return;
    }

    // send reminder
    await this.sendReminder(user, context);
  }

  private async readUserTodaysHydrationLogs(
    userId: string,
    context: Context,
  ): Promise<HydrationLog[]> {
    const { fromDate, toDate } = todayRange(resolveTimeZone());
    const {
      hydrationLogs,
    } = await this.hydrationLogTransporter.readHydrationLogsByDateRangeV1(
      { userId, fromDate, toDate },
      context,
    );
    return hydrationLogs;
  }

  private shouldSendReminder(
    userId: string,
    now: DateTime,
    timeStart: number,
    timeEnd: number,
    plan: HydrationDailyPlan,
    logs: HydrationLog[],
    context: Context,
  ): boolean {
    const contextForLog = {
      ...context,
      userId,
    };

    const glasses = sumGlassFractions(logs.map(log => log.glassFraction));
    const lastLog = logs.sort((a, b) => b.loggedAt - a.loggedAt)[0];
    const nowMinute = this.minuteSinceMidnight(now.hour, now.minute);

    // if disabled
    if (!plan.reminders.enabled) {
      this.logger.debug('Hydration reminders disabled', contextForLog);
      return false;
    }

    // if already hit the goal
    if (glasses >= plan.goals.glasses) {
      this.logger.debug('Already hit hydration goals', contextForLog);
      return false;
    }

    // last logged at
    const lastLoggedAt = !!lastLog
      ? lastLog.loggedAt
      : lastMidnight(resolveTimeZone());
    this.logger.debug('Last hydration logged at', {
      ...contextForLog,
      time: new Date(lastLoggedAt).toISOString(),
    });

    let shouldSend = false;
    // find matching reminder
    plan.reminders.entries.forEach(reminder => {
      const startMinute = this.minuteSinceMidnight(
        reminder.startHour,
        reminder.startMinute,
      );
      const endMinute = this.minuteSinceMidnight(
        reminder.endHour,
        reminder.endMinute,
      );

      // skip if not between reminder start/end time
      if (nowMinute < startMinute || nowMinute >= endMinute) {
        this.logger.debug('Outside hydration reminder time', contextForLog);
        return;
      }

      // send reminder if any of the reminder times hits this cron period
      const reminderTimes = this.resolveReminderTimes(
        now,
        reminder,
        lastLoggedAt,
      );
      const reminderHitPeriod = reminderTimes.some(time => {
        return time >= timeStart && time < timeEnd;
      })
      this.logger.debug('Hydration reminder hit cron period check', {
        ...contextForLog,
        reminderHitPeriod,
        startMinute,
        endMinute,
        nowMinute,
        reminderTimes,
        timeStart,
        timeEnd,
      })
      if (reminderHitPeriod) {
        shouldSend = true;
      }
    });

    return shouldSend;
  }

  private async sendReminder(
    user: UserWithoutPassword,
    context: Context,
  ): Promise<void> {
    // message
    const messageKey = randomKeyByPrefix(
      HydrationReminderServiceTranslations,
      'reminder-notification-',
    );
    const message = this.translate(messageKey);

    // send
    await this.usersNotificationsTransporter.sendBasicUserNotification(
      {
        userId: user.id,
        notification: {
          message,
        },
      },
      context,
    );
  }

  private resolveReminderTimes(
    now: DateTime,
    reminder: HydrationDailyPlanReminderEntry,
    lastLogTime: number,
  ): number[] {
    const reminderTimes: number[] = [];
    let time = lastLogTime + minutesToMs(reminder.minutesSinceLastWaterIntake);
    while (time < now.toMillis()) {
      reminderTimes.push(time);
      time += minutesToMs(reminder.periodInMinutes);
    }
    return reminderTimes;
  }

  private minuteSinceMidnight(hour: number, minute: number): number {
    return hour * 60 + minute;
  }
}