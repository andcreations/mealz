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
  getBoolEnv,
  getStrEnv,
  resolveTimeZone,
  TranslateFunc,
} from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import { AIProvider } from '@mealz/backend-ai';
import { UserWithoutPassword } from '@mealz/backend-users-common';
import { Meal, MealCalculator, MealTotals } from '@mealz/backend-meals-common';
import { 
  UsersCrudTransporter,
} from '@mealz/backend-users-crud-service-api';
import { 
  MealLog, 
  MealsLogTransporter,
} from '@mealz/backend-meals-log-service-api';
import { 
  MealsCrudTransporter,
} from '@mealz/backend-meals-crud-service-api';
import { 
  MealDailyPlan,
  MealsDailyPlanTransporter,
} from '@mealz/backend-meals-daily-plan-service-api';
import { 
  ChunkedUserNotification,
  ChunkedUserNotificationChunk,
  ChunkedUserNotificationType,
  UsersNotificationsTransporter,
} from '@mealz/backend-users-notifications-service-api';

import { 
  UserDailyInsightsAmounts, 
  UserDailyInsightsMeal, 
  UserDailyInsightsInput,
  GoalsTotals,
} from '../types';
import { UserDailyInsightPrompt } from '../prompts';
import {
  UsersDailyInsightsServiceTranslations,
} from './UsersDailyInsightsService.translations';

@Injectable()
export class UsersDailyInsightsService implements OnModuleInit {
  private static readonly DEFAULT_CRON = '0 22 * * *';
  private static readonly JOB_NAME = 'users-daily-insights';
  private static readonly AI_MAX_TOKENS = 4000;
  private static readonly AI_TEMPERATURE = 0.95;

  private readonly sendNutritionSummary: boolean;
  private readonly sendInsights: boolean;
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly mealCalculator: MealCalculator,
    private readonly aiProvider: AIProvider,
    private readonly usersCrudTransporter: UsersCrudTransporter,
    private readonly mealsLogTransporter: MealsLogTransporter,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsDailyPlanTransporter: MealsDailyPlanTransporter,
    private readonly usersNotificationsTransporter: UsersNotificationsTransporter,
  ) {
    this.translate = createTranslation(UsersDailyInsightsServiceTranslations);
    this.sendNutritionSummary = getBoolEnv(
      'MEALZ_USERS_DAILY_INSIGHTS_SEND_NUTRITION_SUMMARY',
      false,
    );
    this.sendInsights = getBoolEnv(
      'MEALZ_USERS_DAILY_INSIGHTS_SEND_INSIGHTS',
      false,
    );
  }

  public async onModuleInit(): Promise<void> {
    const context = BOOTSTRAP_CONTEXT;

    if (!this.sendNutritionSummary && !this.sendInsights) {
      this.logger.info('Daily insights are disabled', context);
      return;
    }

    // create job
    const cronExpression = getStrEnv(
      'MEALZ_USERS_DAILY_INSIGHTS_CRON',
      UsersDailyInsightsService.DEFAULT_CRON,
    );
    const job = new CronJob(
      cronExpression,
      () => { this.generateInsights(); },
      undefined,
      undefined,
      resolveTimeZone(),
    );

    // schedule the job
    this.logger.info('Scheduling daily insights generation', {
      ...context,
      cronExpression,
    });
    this.schedulerRegistry.addCronJob(UsersDailyInsightsService.JOB_NAME, job);
    job.start();
  }

  private async generateInsights(): Promise<void> {
    const context: Context = {
      correlationId: generateCorrelationId(UsersDailyInsightsService.JOB_NAME),
    }

    // today
    const dayStart = DateTime
      .now()
      .setZone(resolveTimeZone())
      .minus({ days: 0 })
      .startOf('day');
    const dayEnd = DateTime
      .now()
      .setZone(resolveTimeZone())
      .minus({ days: 0 })
      .endOf('day');

    let lastId: string | undefined = undefined;
    const limit = 100;

    // loop until all users are processed
    while (true) {
      // read users
      const { users } = await this.usersCrudTransporter.readUsersFromLastV1(
        { lastId, limit },
        context,
      );

      // generate insights
      for (const user of users) {
        await this.generateInsightsForUser(
          user,
          dayStart,
          dayEnd,
          context,
        );
      }

      // more
      if (users.length < limit) {
        break;
      }
      lastId = users[users.length - 1].id;
    }
  }

  private async generateInsightsForUser(
    user: UserWithoutPassword,
    dayStart: DateTime,
    dayEnd: DateTime,
    context: Context,
  ): Promise<void> {
    const startTime = Date.now();

    const { 
      canSendMessagesTo,
    } = await this.usersNotificationsTransporter.readUserNotificationsInfoV1(
      { userId: user.id },
      context,
    );
    if (!canSendMessagesTo) {
      this.logger.debug(
        'User cannot send messages, skipping daily insights generation', 
        {
          ...context,
          userId: user.id,
        },
      );
      return;
    }

    // read data
    const data = await this.readDataForUserInsights(
      user.id,
      dayStart,
      dayEnd,
      context,
    );

    // build prompt
    const promptInput = await this.buildInput(data, context);
    const prompt = UserDailyInsightPrompt.generate(promptInput);

    // send nutrition summary
    if (this.sendNutritionSummary) {
      await this.usersNotificationsTransporter.sendChunkedUserNotification(
        {
          userId: user.id,
          notification: this.buildNutritionSummaryNotification(
            promptInput.meals,
            promptInput.overallAmounts,
          ),
        },
        context,
      );
    }
  
    // insights
    if (this.sendInsights) {
      // generate
      const insights = await this.aiProvider.createCompletion({
        prompt,
        maxTokens: UsersDailyInsightsService.AI_MAX_TOKENS,
        temperature: UsersDailyInsightsService.AI_TEMPERATURE,
      });

      // log
      this.logger.info('Generated insights for user', {
        ...context,
        userId: user.id,
        prompt,
        promptInput,
        insights: insights.text,
        duration: Date.now() - startTime,
      });

      // send insights
      await this.usersNotificationsTransporter.sendBasicUserNotification(
        {
          userId: user.id,
          notification: {
            message: insights.text,
          },
        },
        context,
      );
    }
  }

  private async readDataForUserInsights(
    userId: string,
    dayStart: DateTime,
    dayEnd: DateTime,
    context: Context,
  ): Promise<DataForUserInsights> {
    // read meal logs
    const [ { mealLogs }, { mealDailyPlan } ] = await Promise.all([
      this.mealsLogTransporter.readUserMealLogsV1(
        { 
          userId: userId,
          fromDate: dayStart.toMillis(),
          toDate: dayEnd.toMillis(),
        },
        context,
      ),
      this.mealsDailyPlanTransporter.readUserCurrentMealDailyPlanV1(
        { userId: userId },
        context,
      ),
    ]);

    // read meals
    const [ { meals } ] = await Promise.all([
      this.mealsCrudTransporter.readMealsByIdV1(
        { ids: mealLogs.map(mealLog => mealLog.mealId) },
        context,
      ),
    ]);

    return {
      mealLogs,
      meals,
      mealDailyPlan,
    }
  }

  private async buildInput(
    data: DataForUserInsights,
    context: Context,
  ): Promise<UserDailyInsightsInput> {
    const dailyTotals: MealTotals = {
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    };
    const dailyGoals: GoalsTotals = {
      caloriesFrom: 0,
      caloriesTo: 0,
      carbsFrom: 0,
      carbsTo: 0,
      fatFrom: 0,
      fatTo: 0,
      proteinFrom: 0,
      proteinTo: 0,
    };

    // meals
    const meals: UserDailyInsightsMeal[] = [];
    for (const entry of data.mealDailyPlan.entries) {
      const { goals } = entry;

      // update goals
      dailyGoals.caloriesFrom += goals.caloriesFrom;
      dailyGoals.caloriesTo += goals.caloriesTo;
      dailyGoals.carbsFrom += goals.carbsFrom;
      dailyGoals.carbsTo += goals.carbsTo;
      dailyGoals.fatFrom += goals.fatFrom;
      dailyGoals.fatTo += goals.fatTo;
      dailyGoals.proteinFrom += goals.proteinFrom;
      dailyGoals.proteinTo += goals.proteinTo;

      // find meal
      const mealLog = data.mealLogs.find(mealLog => {
        return mealLog.dailyPlanMealName === entry.mealName;
      });
      const meal = data.meals.find(meal => {
        return meal.id === mealLog?.mealId;
      });
      if (!meal) {
        meals.push({  
          name: entry.mealName, 
          skipped: true,
        });
        continue;
      }

      // meal totals
      const {
        totals: mealTotals,
      } = await this.mealCalculator.calculateAmounts(
        meal,
        context,
      );

      // push meal
      meals.push({
        name: entry.mealName,
        skipped: false,
        amounts: {
          calories: mealTotals.calories,
          caloriesGoalFrom: goals.caloriesFrom,
          caloriesGoalTo: goals.caloriesTo,
          carbs: mealTotals.carbs,
          carbsGoalFrom: goals.carbsFrom,
          carbsGoalTo: goals.carbsTo,
          fat: mealTotals.fat,
          fatGoalFrom: goals.fatFrom,
          fatGoalTo: goals.fatTo,
          protein: mealTotals.protein,
          proteinGoalFrom: goals.proteinFrom,
          proteinGoalTo: goals.proteinTo,
        },
      });

      // update totals
      dailyTotals.calories += mealTotals.calories ?? 0;
      dailyTotals.carbs += mealTotals.carbs ?? 0;
      dailyTotals.fat += mealTotals.fat ?? 0;
      dailyTotals.protein += mealTotals.protein ?? 0;
    }

    // overall goals
    const overallAmounts: UserDailyInsightsAmounts = {
      calories: dailyTotals.calories,
      caloriesGoalFrom: dailyGoals.caloriesFrom,
      caloriesGoalTo: dailyGoals.caloriesTo,
      carbs: dailyTotals.carbs,
      carbsGoalFrom: dailyGoals.carbsFrom,
      carbsGoalTo: dailyGoals.carbsTo,
      fat: dailyTotals.fat,
      fatGoalFrom: dailyGoals.fatFrom,
      fatGoalTo: dailyGoals.fatTo,
      protein: dailyTotals.protein,
      proteinGoalFrom: dailyGoals.proteinFrom,
      proteinGoalTo: dailyGoals.proteinTo,
    };

    return { meals, overallAmounts };
  }

  private buildNutritionSummaryNotification(
    meals: UserDailyInsightsMeal[],
    overallAmounts: UserDailyInsightsAmounts,
  ): ChunkedUserNotification {
    // chunks
    const chunks: ChunkedUserNotificationChunk[] = [];
    const bold = (text: string) => {
      chunks.push({
        type: ChunkedUserNotificationType.Bold,
        text,
      });
    }
    const normal = (text: string) => {  
      chunks.push({
        type: ChunkedUserNotificationType.Normal,
        text,
      });
    }
    const code = (text: string) => {
      chunks.push({
        type: ChunkedUserNotificationType.Code,
        text,
      });
    }
    const newLine = () => normal('\n');

    // title
    bold(this.translate('nutrition-summary-title'));
    newLine();
    newLine();
    
    // amount
    const amount = (
      amount: number,
      goalFrom: number | undefined,
      goalTo: number | undefined,
      unit: string,
      padding: number,
    ) => {
      // amount
      normal(`${amount.toFixed()} ${unit}`);

      // goal
      if (goalFrom != null && goalTo != null) {
        newLine();
        code(' '.repeat(padding))
        normal(
          this.translate('amounts', goalFrom.toFixed(), goalTo.toFixed(), unit)
        );

        const outsideGoal = amount < goalFrom || amount > goalTo;
        if (outsideGoal) {
          normal(' 👈');
        }
      }
    }

    // calories
    const caloriesStr = this.translate('calories');
    code(caloriesStr);
    amount(
      overallAmounts.calories,
      overallAmounts.caloriesGoalFrom,
      overallAmounts.caloriesGoalTo,
      'kcal',
      caloriesStr.length,
    );

    // carbs
    newLine();
    const carbsStr = this.translate('carbs');
    code(carbsStr);
    amount(
      overallAmounts.carbs,
      overallAmounts.carbsGoalFrom,
      overallAmounts.carbsGoalTo,
      'g',
      carbsStr.length,
    );

    // protein
    newLine();
    const proteinStr = this.translate('protein');
    code(proteinStr);
    amount(
      overallAmounts.protein,
      overallAmounts.proteinGoalFrom,
      overallAmounts.proteinGoalTo,
      'g',
      proteinStr.length,
    );

    // fat
    newLine();
    const fatStr = this.translate('fat');
    code(fatStr);
    amount(
      overallAmounts.fat,
      overallAmounts.fatGoalFrom,
      overallAmounts.fatGoalTo,
      'g',
      fatStr.length,
    );
    newLine();

    // meal names
    let maxMealNameLength = 0;
    for (const meal of meals) {
      if (meal.name.length > maxMealNameLength) {
        maxMealNameLength = meal.name.length;
      }
    }

    // meals
    for (const meal of meals) {
      newLine();
      const mealNameStr = meal.name.padStart(maxMealNameLength) + ': ';
      code(mealNameStr);
      if (!meal.skipped) {
        amount(
          meal.amounts.calories,
          meal.amounts.caloriesGoalFrom,
          meal.amounts.caloriesGoalTo,
          'kcal',
          mealNameStr.length,
        );
      }
      else {
        normal(this.translate('skipped'));
      }
    }

    return { chunks };
  }
}

interface DataForUserInsights {
  mealLogs: MealLog[];
  meals: Meal[];
  mealDailyPlan?: MealDailyPlan;
}