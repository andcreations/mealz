import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  ReadMealByIdRequestV1,
  ReadMealByIdResponseV1,  
  CreateMealRequestV1,
  CreateMealResponseV1,
  UpsertMealRequestV1,
  DeleteMealByIdRequestV1,
} from '@mealz/backend-meals-crud-service-api';

import { MealByIdNotFoundError } from '../errors';
import { MealsCrudRepository } from '../repositories';

@Injectable()
export class MealsCrudService {
  public constructor(
    private readonly mealsCrudRepository: MealsCrudRepository,
  ) {
    // TODO Remove this
    setTimeout(async () => {
      // await this.createMealV1(
      //   {
      //     meal: {
      //       calories: 148,
      //       ingredients: [
      //         {
      //           ingredientId: 'test-001',
      //           enteredAmount: '100',
      //         },
      //         {
      //           ingredientId: 'test-002',
      //         },
      //         {
      //           adHocIngredient: {
      //             name: 'ad-hoc-1',
      //             caloriesPer100: 198,
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     correlationId: 'test',
      //   },
      // )

      // const r = await this.readMealByIdV1(
      //   {
      //     // id: '01985b68-723d-7734-94a0-c98705934590',
      //     id: 'meal-001',
      //   },
      //   {
      //     correlationId: 'test',
      //   },
      // );
      // console.log(JSON.stringify(r, null, 2));

      // await this.upsertMealV1(
      //   {
      //     meal: {
      //       id: 'meal-001',
      //       calories: 10,
      //       ingredients: [
      //         {
      //           ingredientId: 'ingredient-001',
      //           enteredAmount: '345'
      //         },
      //       ]
      //     }
      //   },
      //   {
      //     correlationId: 'test',
      //   },
      // )

      // await this.deleteMealByIdV1(
      //   {
      //     id: 'meal-001', 
      //   },
      //   {
      //     correlationId: 'test',
      //   },
      // );

      console.log('<- done');
    }, 1024);
  }

  public async readMealByIdV1(
    request: ReadMealByIdRequestV1,
    context: Context,
  ): Promise<ReadMealByIdResponseV1> {
    const { id } = request;
    const meal = await this.mealsCrudRepository.readMealById(id, context);
    if (!meal) {
      throw new MealByIdNotFoundError(id);
    }
    return { meal };
  }

  public async createMealV1(
    request: CreateMealRequestV1,
    context: Context,
  ): Promise<CreateMealResponseV1> {
    const result = await this.mealsCrudRepository.createMeal(
      request.meal,
      context,
    );
    return { id: result.id };
  }

  public async upsertMealV1(
    request: UpsertMealRequestV1,
    context: Context,
  ): Promise<void> {
    await this.mealsCrudRepository.upsertMeal(request.meal, context);
  }

  public async deleteMealByIdV1(
    request: DeleteMealByIdRequestV1,
    context: Context,
  ): Promise<void> {
    await this.mealsCrudRepository.deleteMealById(request.id, context);
  }
}
