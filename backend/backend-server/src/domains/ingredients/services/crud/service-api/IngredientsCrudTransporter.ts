import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Transporter } from '@mealz/backend-transport';

import { INGREDIENTS_CRUD_TRANSPORTER_TOKEN } from './inject-tokens';
import { ReadFromLastRequestV1, ReadFromLastResponseV1 } from './dtos';
import { IngredientsCrudTopics } from './IngredientsCrudTopics';

export class IngredientsCrudTransporter {
  public constructor(
    @Inject(INGREDIENTS_CRUD_TRANSPORTER_TOKEN)
    private readonly transporter: Transporter,
  ) {}

  public async readFromLast(
    request: ReadFromLastRequestV1,
    context: Context,
  ): Promise<ReadFromLastResponseV1> {
    return this.transporter.sendRequest(
      IngredientsCrudTopics.ReadFromLast,
      request,
      context,
    );
  }
}