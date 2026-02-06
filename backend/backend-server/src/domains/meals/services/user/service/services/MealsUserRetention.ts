import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { TimePeriod } from '@andcreations/common';
import {
  BOOTSTRAP_CONTEXT,
  Context,
  generateCorrelationId,
} from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { getStrEnv, resolveTimeZone } from '@mealz/backend-common';
import { WithActiveSpan } from '@mealz/backend-tracing';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import { 
  AdminNotificationType,
  AdminNotification,
  AdminNotificationsTransporter,
} from '@mealz/backend-admin-notifications-service-api';

import { 
  MealsUserRetentionRepository,
  UserMealForDeletion,
} from '../repositories';

@Injectable()
export class MealsUserRetention implements OnModuleInit {
  private static readonly DEFAULT_RETENTION_PERIOD = '7d';
  private static readonly DEFAULT_CRON = '0 2 * * *';
  private static readonly JOB_NAME = 'meals-user-retention';

  private readonly retentionInMillis: number;

  public constructor(
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly adminNotificationsTransporter:
      AdminNotificationsTransporter,
    private readonly mealsUserRetentionRepository: MealsUserRetentionRepository,
  ) {
    this.retentionInMillis = TimePeriod.fromStr(getStrEnv(
      'MEALZ_MEALS_USER_RETENTION_PERIOD',
      MealsUserRetention.DEFAULT_RETENTION_PERIOD),
    );
  }

  public async onModuleInit(): Promise<void> {
    const context = BOOTSTRAP_CONTEXT;

    // create job
    const cronExpression = getStrEnv(
      'MEALZ_MEALS_USER_RETENTION_CRON',
      MealsUserRetention.DEFAULT_CRON,
    );
    const job = new CronJob(
      cronExpression,
      () => { this.deleteUserMeals(); },
      undefined,
      undefined,
      resolveTimeZone(),
    );

    // schedule the job
    this.logger.info('Scheduling user meals deletion', {
      ...context,
      cronExpression,
    });
    this.schedulerRegistry.addCronJob(MealsUserRetention.JOB_NAME, job);
    job.start();    
  }

  @WithActiveSpan('MealsUserRetention.deleteUserMeals')
  private async deleteUserMeals(): Promise<void> {
    const context: Context = {
      correlationId: generateCorrelationId(MealsUserRetention.JOB_NAME),
    }

    const createdBefore = Date.now() - this.retentionInMillis;
    let deletedCount = 0;
    let failedCount = 0;

    this.logger.info('Deleting user meals', {
      ...context,
      createdBefore: DateTime.fromMillis(createdBefore).toISO() ,
    });

    let lastId: string | undefined = undefined;
    const limit = 100;
  
    // loop until all user meals are deleted
    while (true) {
      const userMeals = await this.mealsUserRetentionRepository
        .readCreatedBefore(
          createdBefore,
          lastId,
          limit,
          context,
        );
      
      for (const userMeal of userMeals) {
        try {
          await this.deleteUserMeal(userMeal, context);
          deletedCount++;
        } catch (error) {
          this.logger.error(
            'Error deleting user meal',
            {
              ...context,
              userMealId: userMeal.id,
            },
            error,
          );
          failedCount++;
        }
      }

      // more
      if (userMeals.length < limit) {
        break;
      }
      lastId = userMeals[userMeals.length - 1].id;
    }

    this.logger.info('Deleted user meals', {
      ...context,
      deletedCount,
      failedCount,
    });

    // notify if failed
    if (failedCount > 0) {
      const notification: AdminNotification = {
        type: AdminNotificationType.Error,
        title: 'Meals user retention',
        message: `Failed to delete ${failedCount} user meals`,
      };
      await this.adminNotificationsTransporter.sendAdminNotificationV1(
        { notification },
        context,
      );
    }
  }

  private async deleteUserMeal(
    userMeal: UserMealForDeletion,
    context: Context,
  ): Promise<void> {
    await this.mealsCrudTransporter.deleteMealByIdV1(
      { id: userMeal.mealId },
      context,
    );
    await this.mealsUserRetentionRepository.deleteById(
      userMeal.id,
      context,
    );
  }
}