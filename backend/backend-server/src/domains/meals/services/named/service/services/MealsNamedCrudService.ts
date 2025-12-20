import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  InternalError,
  MealzError,
  Saga,
  SagaService,
} from '@mealz/backend-common';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { Meal } from '@mealz/backend-meals-common';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import {
  NamedMeal,
  CreateNamedMealRequestV1,
  CreateNamedMealResponseV1,
  ReadNamedMealsFromLastRequestV1,
  ReadNamedMealsFromLastResponseV1,
  UpdateNamedMealRequestV1,
  ReadNamedMealByIdResponseV1,
  ReadNamedMealByIdRequestV1,
  DeleteNamedMealRequestV1,
} from '@mealz/backend-meals-named-service-api';

import { NamedMealAlreadyExistsError, NamedMealNotFoundError } from '../errors';
import { MealsNamedCrudRepository } from '../repositories';

@Injectable()
export class MealsNamedCrudService {
  public constructor(
    private readonly sagaService: SagaService,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsNamedCrudRepository: MealsNamedCrudRepository,
  ) {}

  public async readNamedMealByIdV1(
    request: ReadNamedMealByIdRequestV1,
    context: Context,
  ): Promise<ReadNamedMealByIdResponseV1> {
    const namedMeal = await this.mealsNamedCrudRepository.readById(
      request.id,
      context,
    );
    if (!namedMeal || namedMeal.userId !== request.userId) {
      throw new NamedMealNotFoundError(request.id);
    }
    return { namedMeal };
  }

  public async createNamedMealV1(
    request: CreateNamedMealRequestV1,
    context: Context,
  ): Promise<CreateNamedMealResponseV1> {
    const { userId, meal, mealName } = request;

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
          getId: () => 'check-name',
          do: async () => {
            const namedMeal =
              await this.mealsNamedCrudRepository.readByUserIdAndMealName(
                userId,
                mealName,
                context,
              );
            if (namedMeal) {
              throw new NamedMealAlreadyExistsError(mealName);
            }
          },
        },
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
            const { id } = await this.mealsNamedCrudRepository.create(
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
              await this.mealsNamedCrudRepository.deleteById(
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

  public async updateNamedMealV1(
    request: UpdateNamedMealRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const { namedMealId, userId, meal, mealName } = request;

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
          getId: () => 'check-exists',
          do: async () => {
            const namedMeal = await this.mealsNamedCrudRepository.readById(
              namedMealId,
              context,
            );
            if (!namedMeal) {
              throw new NamedMealNotFoundError(namedMealId);
            }
          },
        },
        {
          getId: () => 'check-access-and-name',
          do: async () => {
            const namedMeal =
              await this.mealsNamedCrudRepository.readByUserIdAndMealName(
                userId,
                mealName,
                context,
              );

            // cannot update if there is another named meal with the same name
            if (namedMeal && namedMeal.id !== namedMealId) {
              throw new NamedMealAlreadyExistsError(mealName);
            }
          },
        },
        {
          // Read the named meal to get the meal identifier and
          // to be able to rollback the changes.          
          getId: () => 'read-named-meal',
          do: async (sagaContext: SagaContext) => {
            const namedMeal = await this.mealsNamedCrudRepository.readById(
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
          getId: () => 'update-named-meal',
          condition: async (sagaContext: SagaContext) => {
            // if the fields to be updated differ from the original named meal
            return sagaContext.originalNamedMeal.mealName !== mealName;
          },
          do: async (sagaContext: SagaContext) => {
            await this.mealsNamedCrudRepository.update(
              { 
                id: namedMealId,
                mealName,
              },
              context,
            );
          },
          undo: async (sagaContext: SagaContext) => {
            await this.mealsNamedCrudRepository.update(
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
    
    return {};
  }

  public async readNamedMealsFromLastV1(
    request: ReadNamedMealsFromLastRequestV1,
    context: Context,
  ): Promise<ReadNamedMealsFromLastResponseV1> {
    const namedMeals = await this.mealsNamedCrudRepository.readFromLastByUserId(
      request.lastId,
      request.limit,
      request.userId,
      context,
    );
    return { namedMeals };
  }

  public async deleteNamedMealV1(
    request: DeleteNamedMealRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const namedMeal = await this.mealsNamedCrudRepository.readById(
      request.id,
      context,
    );
    if (!namedMeal || namedMeal.userId !== request.userId) {
      throw new NamedMealNotFoundError(request.id);
    }
    await this.mealsNamedCrudRepository.deleteById(request.id, context);
    return {};
  }
}