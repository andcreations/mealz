import { Injectable } from '@nestjs/common';
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
import { NamedMeal } from '@mealz/backend-meals-named-service-api';

import { MealsNamedCrudRepository } from '../repositories';

@Injectable()
export class MealsNamedCrudService {
  public constructor(
    private readonly logger: Logger,
    private readonly sagaService: SagaService,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsNamedCrudRepository: MealsNamedCrudRepository,
  ) {
    // setTimeout(async () => {
    //   // console.log('-> test');
    //   // await this.upsertNamedMeal(
    //   //   '019b26a2-2214-74de-af5b-177707b53125',
    //   //   {
    //   //     calories: 100,
    //   //     ingredients: [
    //   //       {
    //   //         ingredientId: '019ad613-7acd-72ba-986e-5cd338bcd1b8',
    //   //         enteredAmount: '50',
    //   //         calculatedAmount: 50,
    //   //       },
    //   //       {
    //   //         ingredientId: '019ad613-7cdd-7750-81b4-0bf9ba32ed0a',
    //   //         enteredAmount: '150',
    //   //         calculatedAmount: 150,
    //   //       }
    //   //     ],
    //   //   },
    //   //   {
    //   //     correlationId: 'test',
    //   //   }        
    //   // );

    //   // await this.createNamedMeal(
    //   //   'deadbabe',
    //   //   {
    //   //     calories: 100,
    //   //     ingredients: [
    //   //       {
    //   //         ingredientId: '019ad613-7acd-72ba-986e-5cd338bcd1b8',
    //   //         enteredAmount: '50',
    //   //         calculatedAmount: 50,
    //   //       }
    //   //     ],
    //   //   },
    //   //   'test-meal-01',
    //   //   {
    //   //     correlationId: 'test',
    //   //   }        
    //   // );

    //   console.log('<- test');
    // }, 1000);
  }

  public async createNamedMeal(
    userId: string | undefined,
    meal: MealWithoutId,
    mealName: string,
    context: Context,
  ): Promise<Pick<NamedMeal, 'id'>> {
    // saga context
    type SagaContext = {
      newMealId?: string;
      newNamedMealId?: string;
    };

    // saga
    const saga: Saga<SagaContext> = {
      id: `create-named-meal`,
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
          getId: () => 'create-named-meal',
          do: async (sagaContext: SagaContext) => {
            const { id } = await this.mealsNamedCrudRepository.createNamedMeal(
              {
                mealId: sagaContext.newMealId,
                userId,
                mealName,
              },
              context,
            );
            sagaContext.newNamedMealId = id;
          },
          undo: async (sagaContext: SagaContext) => {
            if (sagaContext.newNamedMealId) {
              await this.mealsNamedCrudRepository.deleteNamedMealById(
                sagaContext.newNamedMealId,
                context,
              );
            }
          },
        },
      ],
    };

    // run the saga
    const sagaContext: SagaContext = {};
    await this.sagaService.run(saga, sagaContext, context);

    return { id: sagaContext.newNamedMealId };    
  }

  public async upsertNamedMeal(
    namedMealId: string,
    meal: MealWithoutId,
    context: Context,
  ): Promise<void> {
    // saga context
    type SagaContext = {
      originalNamedMeal?: NamedMeal;
      originalMeal?: Meal;
    };

    // saga
    const saga: Saga<SagaContext> = {
      id: `upsert-named-meal`,
      operations: [
        {
          // Read the named meal to get the meal identifier and
          // to be able to rollback the changes.          
          getId: () => 'read-named-meal',
          do: async (sagaContext: SagaContext) => {
            const namedMeal = await this.mealsNamedCrudRepository.readNameMealById(
              namedMealId,
              context,
            );
            sagaContext.originalNamedMeal = namedMeal;
          },
        },
        {
          // Read the meal to be able to rollback the changes.
          getId: () => 'read-meal',
          do: async (sagaContext: SagaContext) => {
            const mealId = sagaContext.originalNamedMeal.mealId;
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
          getId: () => 'upsert-named-meal',
          do: async (sagaContext: SagaContext) => {
            await this.mealsNamedCrudRepository.upsertNamedMeal(
              { 
                id: namedMealId,
                userId: sagaContext.originalNamedMeal.userId,
                mealName: sagaContext.originalNamedMeal.mealName,
                mealId: sagaContext.originalNamedMeal.mealId,
              },
              context,
            );
          },
          undo: async (sagaContext: SagaContext) => {
            await this.mealsNamedCrudRepository.upsertNamedMeal(
              sagaContext.originalNamedMeal,
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
}