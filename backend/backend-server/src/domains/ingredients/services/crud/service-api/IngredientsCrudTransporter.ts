import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Transporter } from '@mealz/backend-transport';

import { INGREDIENTS_CRUD_TRANSPORTER_TOKEN } from './inject-tokens';
import { IngredientsCrudTopics } from './IngredientsCrudTopics';
import { ReadFromLastRequestV1, ReadFromLastResponseV1 } from './dtos';

@Injectable()
export class IngredientsCrudTransporter {
  public constructor(
    @Inject(INGREDIENTS_CRUD_TRANSPORTER_TOKEN)
    private readonly transporter: Transporter,
  ) {}

  public async readFromLastV1(
    request: ReadFromLastRequestV1,
    context: Context,
  ): Promise<ReadFromLastResponseV1> {
    return this.transporter.sendRequest<
      ReadFromLastRequestV1, ReadFromLastResponseV1
    >(
      IngredientsCrudTopics.ReadFromLastV1,
      request,
      context,
    );
  }
}