import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { GWIngredientMapper } from '@mealz/backend-ingredients-gateway-common';
import {
  IngredientsCrudTransporter,
  ReadIngredientsFromLastRequestV1,
} from '@mealz/backend-ingredients-crud-service-api';
import { 
  ReadIngredientsFromLastGWResponseV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

import { ReadIngredientsFromLastGWQueryParamsV1 } from '../dtos';

@Injectable()
export class IngredientsCrudGWService {
  public constructor(
    private readonly ingredientsCrudTransporter: IngredientsCrudTransporter,
    private readonly gwIngredientMapper: GWIngredientMapper,
  ) {}

  public async readFromLastV1(
    gwParams: ReadIngredientsFromLastGWQueryParamsV1,
    context: Context,
  ): Promise<ReadIngredientsFromLastGWResponseV1> {
    const request: ReadIngredientsFromLastRequestV1 = {
      lastId: gwParams.lastId,
      limit: gwParams.limit,
    };
    const response = await this.ingredientsCrudTransporter.readFromLastV1(
      request,
      context,
    );
    return {
      ingredients: response.ingredients.map(ingredient =>
        this.gwIngredientMapper.fromIngredient(ingredient),
      ),
    };
  }
}