import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { ifDefined } from '@mealz/backend-shared';
import { Saga, SagaService } from '@mealz/backend-common';
import { Meal } from '@mealz/backend-meals-common';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import {
  UserMeal,
  ReadManyUserMealsRequestV1,
  ReadManyUserMealsResponseV1,
  CreateUserMealRequestV1,
  CreateUserMealResponseV1,
  UpsertUserMealRequestV1,
  UpsertUserMealResponseV1,
} from '@mealz/backend-meals-user-service-api';

import { MealsUserRepository } from '../repositories';

@Injectable()
export class MealsUserService {
  public constructor(
    private readonly sagaService: SagaService,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsUserRepository: MealsUserRepository,
  ) {
    // TODO Remove this
    // setTimeout(async () => {
      // try {
      //   await this.createUserMealV1(
      //     {
      //       meal: {
      //         calories: 148,
      //         ingredients: [
      //           {
      //             ingredientId: 'test-001',
      //             enteredAmount: '100',
      //           },
      //           {
      //             ingredientId: 'test-002',
      //           },
      //           {
      //             adHocIngredient: {
      //               name: 'ad-hoc-1',
      //               caloriesPer100: 198,
      //             }
      //           }
      //         ]
      //       },
      //       type: 'web-cache',
      //       userId: 'ffff'
      //     },
      //     {
      //       correlationId: 'test',
      //     },
      //   )
      // } catch (error) {
      //   console.log('-! failed', error);
      // }

      // try {
      //   const response = await this.upsertUserMealV1(
      //     {
      //       id: '01989416-8684-7649-a75a-f7e74b3effff',
      //       meal: {
      //         calories: 100,
      //         ingredients: [
      //           {
      //             ingredientId: 'test-001',
      //             enteredAmount: '101',
      //           },
      //           {
      //             ingredientId: 'test-002',
      //           },
      //           {
      //             adHocIngredient: {
      //               name: 'ad-hoc-1',
      //               caloriesPer100: 198,
      //             }
      //           }
      //         ]
      //       },
      //       type: 'web-app-cache',
      //       userId: 'ffffeeeedddd'
      //     },
      //     {
      //       correlationId: 'test',
      //     }
      //   );
      //   console.log(response);
      // } catch (error) {
      //   console.log('-! failed', error);
      // }

    //   console.log('<- done.2');
    // }, 1024);
  }

  public async readManyV1(
    request: ReadManyUserMealsRequestV1,
    context: Context,
  ): Promise<ReadManyUserMealsResponseV1> {
    const userMeals = await this.mealsUserRepository.readMany(
      request.lastId,
      request.limit,
      request.userId,
      request.types,
      context,
    );
    return { userMeals };
  }

  public async createUserMealV1(
    request: CreateUserMealRequestV1,
    context: Context,
  ): Promise<CreateUserMealResponseV1> {
    // saga context
    type SagaContext = {
      newMealId?: string;
      newUserMealId?: string;
    };

    // saga
    const saga: Saga<SagaContext> = {
      id: `create-user-meal-v1`,
      operations: [
        {
          getId: () => 'create-meal',
          do: async (sagaContext: SagaContext) => {
            const { id } = await this.mealsCrudTransporter.createMealV1(
              {
                meal: request.meal,
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
          getId: () => 'create-user-meal',
          do: async (sagaContext: SagaContext) => {
            const { id } = await this.mealsUserRepository.createUserMeal(
              {
                mealId: sagaContext.newMealId,
                type: request.type,
                userId: request.userId,
              },
              context,
            );
            sagaContext.newUserMealId = id;
          },
          undo: async (sagaContext: SagaContext) => {
            if (sagaContext.newUserMealId) {
              await this.mealsUserRepository.deleteUserMealById(
                sagaContext.newUserMealId,
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

    return { id: sagaContext.newUserMealId };
  }

  public async upsertUserMealV1(
    request: UpsertUserMealRequestV1,
    context: Context,
  ): Promise<UpsertUserMealResponseV1> {
    // saga context
    type SagaContext = {
      originalUserMeal?: UserMeal;
      originalMeal?: Meal;
      newMealId?: string;
      newUserMealId?: string;
    };

    // saga
    const saga: Saga<SagaContext> = {
      id: `upsert-user-meal-v1`,
      operations: [
        {
          getId: () => 'read-user-meal',
          do: async (sagaContext: SagaContext) => {
            if (!request.id) {
              return;
            }
            const userMeal = await this.mealsUserRepository.readUserMealById(
              request.id,
              context,
            );
            sagaContext.originalUserMeal = userMeal;
          },
        },
        {
          getId: () => 'read-meal',
          do: async (sagaContext: SagaContext) => {
            if (!sagaContext.originalUserMeal) {
              return;
            }
            const { meal } = await this.mealsCrudTransporter.readMealByIdV1(
              {
                id: sagaContext.originalUserMeal.mealId,
              },
              context,
            );
            sagaContext.originalMeal = meal;
          },
        },
        {
          getId: () => 'upsert-meal',
          do: async (sagaContext: SagaContext) => {
            const { id } = await this.mealsCrudTransporter.upsertMealV1(
              {
                meal: {
                  ...request.meal,
                  ...ifDefined<Meal>('id', sagaContext.originalMeal?.id),
                }
              },
              context,
            );
            if (!sagaContext.originalMeal) {
              sagaContext.newMealId = id;
            }
          },
          undo: async (sagaContext: SagaContext) => {
            if (sagaContext.originalMeal) {
              await this.mealsCrudTransporter.upsertMealV1(
                { meal: sagaContext.originalMeal },
                context,
              );
              return;
            }
            if (sagaContext.newMealId) {
              await this.mealsCrudTransporter.deleteMealByIdV1(
                { id: sagaContext.newMealId },
                context,
              );
              return;
            }
          },
        },
        {
          getId: () => 'upsert-user-meal',
          do: async (sagaContext: SagaContext) => {
            const mealId = (
              sagaContext.originalMeal?.id ??
              sagaContext.newMealId
            );
            const userMealId = (
              sagaContext.originalUserMeal?.id ??
              request.id
            );
            const { id } = await this.mealsUserRepository.upsertUserMeal(
              {
                mealId,
                type: request.type,
                userId: request.userId,
                ...ifDefined<UserMeal>('id', userMealId),
              },
              context,
            );
            if (!sagaContext.originalUserMeal) {
              sagaContext.newUserMealId = id;
            }
          },
          undo: async (sagaContext: SagaContext) => {
            if (sagaContext.originalUserMeal) {
              await this.mealsUserRepository.upsertUserMeal(
                sagaContext.originalUserMeal,
                context,
              );
              return;
            }
            if (sagaContext.newUserMealId) {
              await this.mealsUserRepository.deleteUserMealById(
                sagaContext.newUserMealId,
                context,
              );
              return;
            }
          },
        }
      ],
    };

    // run the saga
    const sagaContext: SagaContext = {};
    await this.sagaService.run(saga, sagaContext, context);

    const userMealId = (
      sagaContext.originalUserMeal?.id ??
      sagaContext.newUserMealId
    );
    return { id: userMealId };
  }
}