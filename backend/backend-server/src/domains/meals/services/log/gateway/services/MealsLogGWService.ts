import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  LogMealRequestV1,
  MealsLogTransporter,
  SummarizeMealLogRequestV1,
  SummarizeMealLogResponseV1,
} from '@mealz/backend-meals-log-service-api';
import { LogMealGWRequestV1, LogMealGWResponseV1 } from '@mealz/backend-meals-log-gateway-api';
import { roundToTwoDecimals } from '@mealz/backend-gateway-common';

import { SummarizeMealLogQueryParamsV1 } from '../dtos';
import { GWMealLogMapper } from './GWMealLogMapper';

@Injectable()
export class MealsLogGWService {
  public constructor(
    private readonly gwMealLogMapper: GWMealLogMapper,
    private readonly mealsLogTransporter: MealsLogTransporter,
  ) {}

  public async logMealV1(
    gwRequest: LogMealGWRequestV1,
    userId: string,
    context: Context,
  ): Promise<LogMealGWResponseV1> {
    const request: LogMealRequestV1 = {
      userId,
      meal: gwRequest.meal,
      dailyPlanMealName: gwRequest.dailyPlanMealName,
      timeZone: gwRequest.timeZone,
    };
    const { id, status } = await this.mealsLogTransporter.logMealV1(
      request,
      context,
    );
    return {
      id,
      status: this.gwMealLogMapper.fromStatus(status),
    };
  }

  public async summarizeMacrosV1(
    gwParams: SummarizeMealLogQueryParamsV1,
    userId: string,
    context: Context,
  ): Promise<SummarizeMealLogResponseV1> {
    const request: SummarizeMealLogRequestV1 = {
      userId,
      fromDate: gwParams.fromDate,
      toDate: gwParams.toDate,
    };
    const { summary} = await this.mealsLogTransporter.summarizeMacrosV1(
      request,
      context,
    );
    return {
      summary: {
        calories: roundToTwoDecimals(summary.calories),
        carbs: roundToTwoDecimals(summary.carbs),
        protein: roundToTwoDecimals(summary.protein),
        fat: roundToTwoDecimals(summary.fat),
      },
    };
  }
}