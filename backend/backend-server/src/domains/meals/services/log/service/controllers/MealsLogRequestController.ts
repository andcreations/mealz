import { Context } from '@mealz/backend-core';
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import {
  LogMealRequestV1,
  LogMealResponseV1,
  MealsLogRequestTopics,
} from '@mealz/backend-meals-log-service-api';

import { MealsLogService } from '../services';

@RequestController()
export class MealsLogRequestController {
  public constructor(private readonly mealsLogService: MealsLogService) {
  }

  @RequestHandler(MealsLogRequestTopics.LogMealV1)
  public async logMealV1(
    request: LogMealRequestV1,
    context: Context,
  ): Promise<LogMealResponseV1> {
    return this.mealsLogService.logMealV1(request, context);
  }
}