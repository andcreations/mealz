import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { 
  InternalError,
  MealzError,
  Saga,
  SagaService,
} from '@mealz/backend-common';
import { Meal, MealWithoutId } from '@mealz/backend-meals-common';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import {
  MealLog,
  LogMealResponseStatusV1,
  LogMealRequestV1,
  LogMealResponseV1,
} from '@mealz/backend-meals-log-service-api';

import { MealsLogCrudRepository } from '../repositories';

@Injectable()
export class MealsLogCrudService {
  public constructor(
    private readonly logger: Logger,
    private readonly sagaService: SagaService,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsLogCrudRepository: MealsLogCrudRepository,
  ) {}

  private async createMealLog(
    userId: string,
    meal: MealWithoutId,
    loggedAt: number,
    dailyPlanMealName: string | undefined,
    context: Context,
  ): Promise<Pick<MealLog, 'id'>> {
    // saga context
    type SagaContext = {
      newMealId?: string;
      newMealLogId?: string;
    };

    // saga
    const saga: Saga<SagaContext> = {
      id: `create-meal-log`,
      operations: [
        {
          getId: () => 'create-meal',
          do: async (sagaContext: SagaContext) => {
            const { id } = await this.mealsCrudTransporter.createMealV1(
              {
                meal,
              },
              context,
            );
            sagaContext.newMealId = id;
          },
          undo: async (sagaContext: SagaContext) => {
            if (sagaContext.newMealId) {
              await this.mealsCrudTransporter.deleteMealByIdV1(
                {
                  id: sagaContext.newMealId,
                },
                context,
              );
            }
          },
        },
        {
          getId: () => 'create-meal-log',
          do: async (sagaContext: SagaContext) => {
            const { id } = await this.mealsLogCrudRepository.create(
              {
                mealId: sagaContext.newMealId,
                userId,
                dailyPlanMealName,
                loggedAt,
              },
              context,
            );
            sagaContext.newMealLogId = id;
          },
          undo: async (sagaContext: SagaContext) => {
            if (sagaContext.newMealLogId) {
              await this.mealsLogCrudRepository.delete(
                sagaContext.newMealLogId,
                context,
              );
            }
          },
        }
      ],
    };

    // run the saga
    const sagaContext: SagaContext = {};
    await this.sagaService.run(saga, sagaContext, context);

    return { id: sagaContext.newMealLogId };
  }

  private async upsertMealLog(
    mealLogId: string,
    userId: string,
    loggedAt: number,
    meal: MealWithoutId,
    dailyPlanMealName: string | undefined,
    context: Context,
  ): Promise<void> {
    // saga context
    type SagaContext = {
      originalMealLog?: MealLog;
      originalMeal?: Meal;
    };

    // saga
    const saga: Saga<SagaContext> = {
      id: `upsert-meal-log-v1`,
      operations: [
        {
          // Read the meal log to get the meal identifier and
          // to be able to rollback the changes.
          getId: () => 'read-meal-log',
          do: async (sagaContext: SagaContext) => {
            const mealLog = await this.mealsLogCrudRepository.readById(
              mealLogId,
              context,
            );
            if (!mealLog) {
              throw new InternalError(
                `Meal log ${MealzError.quote(mealLogId)} not found`
              );
            }
            sagaContext.originalMealLog = mealLog;
          },
        },
        {
          // Read the meal to be able to rollback the changes.
          getId: () => 'read-meal',
          do: async (sagaContext: SagaContext) => {
            const mealId = sagaContext.originalMealLog.mealId;
            const { meal } = await this.mealsCrudTransporter.readMealByIdV1(
              { id: mealId },
              context,
            );
            if (!meal) {
              throw new InternalError(
                `Meal ${MealzError.quote(mealId)} not found`,
              );
            }
            sagaContext.originalMeal = meal;
          }
        },
        {
          getId: () => 'upsert-meal',
          do: async (sagaContext: SagaContext) => {
            await this.mealsCrudTransporter.upsertMealV1(
              {
                meal: {
                  ...meal,
                  id: sagaContext.originalMeal.id,
                }
              },
              context,
            );
          },
          undo: async (sagaContext: SagaContext) => {
            await this.mealsCrudTransporter.upsertMealV1(
              { meal: sagaContext.originalMeal },
              context,
            );
          },
        },        
        {
          getId: () => 'upsert-meal-log',
          do: async (sagaContext: SagaContext) => {
            const { id } = await this.mealsLogCrudRepository.upsert(
              {
                id: mealLogId,
                mealId: sagaContext.originalMealLog.mealId,
                userId,
                dailyPlanMealName,
                loggedAt,
              },
              context,
            );
          },
          undo: async (sagaContext: SagaContext) => {
            await this.mealsLogCrudRepository.upsert(
              sagaContext.originalMealLog,
              context,
            );
          },
        },
      ],
    };

    // run the saga
    const sagaContext: SagaContext = {};
    await this.sagaService.run(saga, sagaContext, context);
  }

  public async logMealV1(
    request: LogMealRequestV1,
    context: Context,
  ): Promise<LogMealResponseV1> {
    const latest = await this.mealsLogCrudRepository.readLatestByUserId(
      request.userId,
      context,
    );
    const now = Date.now();

    let update = false;
    // update existing meal log?
    if (latest) {
      const FORMAT = 'yyyy-MM-dd';
      const latestDay = DateTime.fromMillis(latest.loggedAt)
        .setZone(request.timeZone)
        .toFormat(FORMAT);
      const nowDay = DateTime.fromMillis(now)
        .setZone(request.timeZone)
        .toFormat(FORMAT);
      console.log(`latestDay: ${latestDay}, nowDay: ${nowDay}`);

      // update if it's the same day and the same meal
      if (
        latestDay === nowDay &&
        latest.dailyPlanMealName === request.dailyPlanMealName
      ) {
        update = true;
      }
    }

    // update
    if (update) {
      this.logger.debug(`Updating meal log`, {
        ...context,
        userId: request.userId,
        meal: request.meal,
        latest,
      });
      await this.upsertMealLog(
        latest.id,
        request.userId,
        now,
        request.meal,
        request.dailyPlanMealName,
        context,
      );
      return {
        id: latest.id,
        status: LogMealResponseStatusV1.Updated,
      };
    }

    // create
    this.logger.debug(`Creating meal log`, {
      ...context,
      userId: request.userId,
      meal: request.meal,
    });
    const { id } = await this.createMealLog(
      request.userId,
      request.meal,
      now,
      request.dailyPlanMealName,
      context,
    );
    return {
      id,
      status: LogMealResponseStatusV1.Created,
    };
  }
}