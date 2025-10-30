import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { INGREDIENTS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { IngredientsCrudRequestTopics } from './IngredientsCrudRequestTopics';
import {
  ReadIngredientsFromLastRequestV1,
  ReadIngredientsFromLastResponseV1,
} from './dtos';

@Injectable()
export class IngredientsCrudTransporter {
  public constructor(
    @Inject(INGREDIENTS_CRUD_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readFromLastV1(
    request: ReadIngredientsFromLastRequestV1,
    context: Context,
  ): Promise<ReadIngredientsFromLastResponseV1> {
    return this.transporter.sendRequest<
      ReadIngredientsFromLastRequestV1, ReadIngredientsFromLastResponseV1
    >(
      IngredientsCrudRequestTopics.ReadFromLastV1,
      request,
      context,
    );
  }
}