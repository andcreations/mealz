import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  ReadMealByIdRequestV1,
  ReadMealByIdResponseV1,  
  ReadMealsByIdRequestV1,
  ReadMealsByIdResponseV1,  
  CreateMealRequestV1,
  CreateMealResponseV1,
  UpsertMealRequestV1,
  UpsertMealResponseV1,
  DeleteMealByIdRequestV1,
} from '@mealz/backend-meals-crud-service-api';

import { MealByIdNotFoundError, MealsByIdNotFoundError } from '../errors';
import { MealsCrudRepository } from '../repositories';

@Injectable()
export class MealsCrudService {
  public constructor(
    private readonly mealsCrudRepository: MealsCrudRepository,
  ) {}

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

  public async readMealsByIdV1(
    request: ReadMealsByIdRequestV1,
    context: Context,
  ): Promise<ReadMealsByIdResponseV1> {
    const { ids } = request;
    const meals = await this.mealsCrudRepository.readMealsById(ids, context);
    if (meals.length < ids.length) {
      const idsNotFound = ids.filter(id => !meals.some(meal => meal.id === id));
      throw new MealsByIdNotFoundError(idsNotFound);
    }
    return { meals };
  }

  public async createMealV1(
    request: CreateMealRequestV1,
    context: Context,
  ): Promise<CreateMealResponseV1> {
    const { id } = await this.mealsCrudRepository.createMeal(
      request.meal,
      context,
    );
    return { id };
  }

  public async upsertMealV1(
    request: UpsertMealRequestV1,
    context: Context,
  ): Promise<UpsertMealResponseV1> {
    const { id } = await this.mealsCrudRepository.upsertMeal(
      request.meal,
      context,
    );
    return { id };
  }

  public async deleteMealByIdV1(
    request: DeleteMealByIdRequestV1,
    context: Context,
  ): Promise<void> {
    await this.mealsCrudRepository.deleteMealById(request.id, context);
  }
}
