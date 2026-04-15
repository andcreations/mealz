import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { DEFAULT_READ_LIMIT } from '@mealz/backend-common';
import { GWIngredientMapper } from '@mealz/backend-ingredients-gateway-common';
import {
  IngredientsCrudTransporter,
  ReadIngredientsFromLastRequestV1,
  UpsertIngredientsRequestV1,
} from '@mealz/backend-ingredients-crud-service-api';
import { 
  ReadIngredientsFromLastGWResponseV1,
} from '@mealz/backend-ingredients-crud-gateway-api';

import { 
  ReadIngredientsFromLastGWQueryParamsV1Impl,
  UpsertIngredientsGWRequestV1Impl,
} from '../dtos';

@Injectable()
export class IngredientsCrudV1GWService {
  public constructor(
    private readonly ingredientsCrudTransporter: IngredientsCrudTransporter,
    private readonly gwIngredientMapper: GWIngredientMapper,
  ) {}

  public async readFromLastV1(
    gwParams: ReadIngredientsFromLastGWQueryParamsV1Impl,
    context: Context,
  ): Promise<ReadIngredientsFromLastGWResponseV1> {
    const request: ReadIngredientsFromLastRequestV1 = {
      lastId: gwParams.lastId,
      limit: gwParams.limit ?? DEFAULT_READ_LIMIT,
    };
    const { 
      ingredients,
    } = await this.ingredientsCrudTransporter.readIngredientsFromLastV1(
      request,
      context,
    );
    return {
      ingredients: ingredients.map(ingredient =>
        this.gwIngredientMapper.fromIngredient(ingredient),
      ),
    };
  }

  public async upsertIngredientsV1(
    gwRequest: UpsertIngredientsGWRequestV1Impl,
    context: Context,
  ): Promise<void> {
    const request: UpsertIngredientsRequestV1 = {
      ingredients: gwRequest.ingredients.map(ingredient =>
        this.gwIngredientMapper.toIngredient(ingredient),
      ),
    };
    await this.ingredientsCrudTransporter.upsertIngredientsV1(
      request,
      context,
    );
  }
}