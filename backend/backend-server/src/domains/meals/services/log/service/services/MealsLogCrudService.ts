import { Injectable } from '@nestjs/common';
import { TimePeriod } from '@andcreations/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { 
  InternalError,
  MealzError,
  requireStrEnv,
  Saga,
  SagaService,
} from '@mealz/backend-common';
import { Meal, MealWithoutId } from '@mealz/backend-meals-common';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import {
  MealLog,
  LogMealRequestV1,
  LogMealResponseV1,
} from '@mealz/backend-meals-log-service-api';

import { MealsLogCrudRepository } from '../repositories';

@Injectable()
export class MealsLogCrudService {
  private readonly upsertOnLogMealPeriod: number;
  
  public constructor(
    private readonly logger: Logger,
    private readonly sagaService: SagaService,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsLogCrudRepository: MealsLogCrudRepository,
  ) {
    this.upsertOnLogMealPeriod = TimePeriod.fromStr(
      requireStrEnv('MEALZ_UPSERT_ON_LOG_MEAL_PERIOD')
    );
  }

  private async createMealLog(
    userId: string,
    meal: MealWithoutId,
    loggedAt: number,
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

    // update existing meal log?
    const update = (
      latest &&
      now - latest.loggedAt < this.upsertOnLogMealPeriod
    );
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
        context,
      );
      return { id: latest.id };
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
      context,
    );
    return { id };
  }
}