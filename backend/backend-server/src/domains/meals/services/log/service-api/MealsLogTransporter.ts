import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { MEALS_LOG_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsLogRequestTopics } from './MealsLogRequestTopics';
import {
  LogMealRequestV1,
  LogMealResponseV1,
  SummarizeMealLogRequestV1,
  SummarizeMealLogResponseV1,
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

  public async summarizeMacrosV1(
    request: SummarizeMealLogRequestV1,
    context: Context,
  ): Promise<SummarizeMealLogResponseV1> {
    return this.transporter.sendRequest<
      SummarizeMealLogRequestV1, SummarizeMealLogResponseV1
    >(
      MealsLogRequestTopics.SummarizeMacrosV1,
      request,
      context,
    );
  }
}