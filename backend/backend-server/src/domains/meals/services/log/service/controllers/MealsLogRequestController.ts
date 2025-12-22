import { Context } from '@mealz/backend-core';
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import {
  LogMealRequestV1,
  LogMealResponseV1,
  MealsLogRequestTopics,
  ReadUserMealLogsRequestV1,
  ReadUserMealLogsResponseV1,
  SummarizeMealLogRequestV1,
  SummarizeMealLogResponseV1,
} from '@mealz/backend-meals-log-service-api';

import { MealsLogCrudService, MealsLogHistoryService } from '../services';

@RequestController()
export class MealsLogRequestController {
  public constructor(
    private readonly mealsLogService: MealsLogCrudService,
    private readonly mealsLogHistoryService: MealsLogHistoryService,
  ) {}

  @RequestHandler(MealsLogRequestTopics.LogMealV1)
  public async logMealV1(
    request: LogMealRequestV1,
    context: Context,
  ): Promise<LogMealResponseV1> {
    return this.mealsLogService.logMealV1(request, context);
  }

  @RequestHandler(MealsLogRequestTopics.SummarizeMacrosV1)
  public async summarizeMacrosV1(
    request: SummarizeMealLogRequestV1,
    context: Context,
  ): Promise<SummarizeMealLogResponseV1> {
    return this.mealsLogHistoryService.summarizeMacrosV1(request, context);
  }

  @RequestHandler(MealsLogRequestTopics.ReadUserMealLogsV1)
  public async readUserMealLogsV1(
    request: ReadUserMealLogsRequestV1,
    context: Context,
  ): Promise<ReadUserMealLogsResponseV1> {
    return this.mealsLogHistoryService.readUserMealLogsV1(request, context);
  }
}