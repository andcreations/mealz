import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { MEALS_LOG_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsLogRequestTopics } from './MealsLogRequestTopics';
import {
  LogMealRequestV1,
  LogMealResponseV1,
} from './dtos';

@Injectable()
export class MealsLogTransporter {
  public constructor(
    @Inject(MEALS_LOG_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async logMealV1(
    request: LogMealRequestV1,
    context: Context,
  ): Promise<LogMealResponseV1> {
    return this.transporter.sendRequest<
      LogMealRequestV1, LogMealResponseV1
    >(
      MealsLogRequestTopics.LogMealV1,
      request,
      context,
    );
  }
}