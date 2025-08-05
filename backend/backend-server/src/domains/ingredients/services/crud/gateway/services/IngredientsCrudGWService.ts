import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { GWIngredientMapper } from '@mealz/backend-ingredients-gateway-common';
import {
  IngredientsCrudTransporter,
  ReadFromLastRequestV1,
} from '@mealz/backend-ingredients-crud-service-api';
import { 
  ReadIngredientsFromLastGWResponseV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

import { ReadFromLastV1GWQueryParams } from '../dtos';

@Injectable()
export class IngredientsCrudGWService {
  public constructor(
    private readonly ingredientsCrudTransporter: IngredientsCrudTransporter,
    private readonly gwIngredientMapper: GWIngredientMapper,
  ) {}

  public async readFromLast(
    gwParams: ReadFromLastV1GWQueryParams,
    context: Context,
  ): Promise<ReadIngredientsFromLastGWResponseV1> {
    const request: ReadFromLastRequestV1 = {
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