import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Saga, SagaService } from '@mealz/backend-common';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import {
  CreateUserMealRequestV1,
  CreateUserMealResponseV1,
  UpsertUserMealRequestV1,
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
    setTimeout(async () => {
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
      console.log('<- done');
    }, 1024);
  }

  public async createUserMealV1(
    request: CreateUserMealRequestV1,
    context: Context,
  ): Promise<CreateUserMealResponseV1> {
    let mealId: string;
    let userMealId: string;

    // create saga
    const saga: Saga = {
      id: `create-user-meal-v1`,
      operations: [
        {
          getId: () => 'create-meal',
          do: async () => {
            const { id } = await this.mealsCrudTransporter.createMealV1(
              {
                meal: request.meal,
              },
              context,
            );
            mealId = id;
          },
          undo: async () => {
            await this.mealsCrudTransporter.deleteMealByIdRequestV1(
              {
                id: mealId,
              },
              context,
            );
          },
        },
        {
          getId: () => 'create-user-meal',
          do: async () => {
            const { id } = await this.mealsUserRepository.createUserMeal(
              {
                mealId,
                type: request.type,
                userId: request.userId,
              },
              context,
            );
            userMealId = id;
          },
          undo: async () => {
            await this.mealsUserRepository.deleteUserMealById(
              userMealId,
              context,
            );
          },
        }
      ],
    }

    // run the sata
    await this.sagaService.run(saga, context);
    return { id: userMealId };
  }

  public async upsertUserMealV1(
    request: UpsertUserMealRequestV1,
    context: Context,
  ): Promise<void> {
    // create saga
    const saga: Saga = {
      id: `upsert-user-meal-v1`,
      operations: []
    };
  }
}