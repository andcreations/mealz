import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { INGREDIENTS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { IngredientsCrudRequestTopics } from './IngredientsCrudRequestTopics';
import {
  ReadIngredientsByIdRequestV1,
  ReadIngredientsByIdResponseV1,
  ReadIngredientsFromLastRequestV1,
  ReadIngredientsFromLastResponseV1,
} from './dtos';

@Injectable()
export class IngredientsCrudTransporter {
  public constructor(
    @Inject(INGREDIENTS_CRUD_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}


  public async readIngredientsByIdV1(
    request: ReadIngredientsByIdRequestV1,
    context: Context,
  ): Promise<ReadIngredientsByIdResponseV1> {
    return this.transporter.sendRequest<
      ReadIngredientsByIdRequestV1, ReadIngredientsByIdResponseV1
    >(
      IngredientsCrudRequestTopics.ReadIngredientsByIdV1,
      request, context,
    );
  }

  public async readIngredientsFromLastV1(
    request: ReadIngredientsFromLastRequestV1,
    context: Context,
  ): Promise<ReadIngredientsFromLastResponseV1> {
    return this.transporter.sendRequest<
      ReadIngredientsFromLastRequestV1, ReadIngredientsFromLastResponseV1
    >(
      IngredientsCrudRequestTopics.ReadIngredientsFromLastV1,
      request,
      context,
    );
  }
}