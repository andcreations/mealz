import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  ReadIngredientsByIdRequestV1,
  ReadIngredientsByIdResponseV1,
  ReadIngredientsFromLastRequestV1,
  ReadIngredientsFromLastResponseV1,
} from '@mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudRepository } from '../repositories';

@Injectable()
export class IngredientsCrudService {
  public constructor(
    private readonly ingredientsCrudRepository: IngredientsCrudRepository,
  ) {}


  public async readIngredientsByIdV1(
    request: ReadIngredientsByIdRequestV1,
    context: Context,
  ): Promise<ReadIngredientsByIdResponseV1> {
    const ingredients = await this.ingredientsCrudRepository.readManyById(
      request.ids,
      context,
    );
    return { ingredients };
  }

  public async readIngredientsFromLastV1(
    request: ReadIngredientsFromLastRequestV1,
    context: Context,
  ): Promise<ReadIngredientsFromLastResponseV1> {
    const ingredients = await this.ingredientsCrudRepository.readFromLast(
      request.lastId,
      request.limit,
      context,
    );
    return { ingredients };
  }
}