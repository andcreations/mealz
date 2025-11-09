import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  LogMealRequestV1,
  MealsLogTransporter,
  SummarizeMealLogRequestV1,
  SummarizeMealLogResponseV1,
} from '@mealz/backend-meals-log-service-api';
import { LogMealGWRequestV1 } from '@mealz/backend-meals-log-gateway-api';
import { roundToTwoDecimals } from '@mealz/backend-gateway-common';

import { SummarizeMealLogQueryParamsV1 } from '../dtos';

@Injectable()
export class MealsLogGWService {
  public constructor(
    private readonly mealsLogTransporter: MealsLogTransporter,
  ) {}

  public async logMealV1(
    gwRequest: LogMealGWRequestV1,
    userId: string,
    context: Context,
  ): Promise<void> {
    const request: LogMealRequestV1 = {
      userId,
      meal: gwRequest.meal,
    };
    await this.mealsLogTransporter.logMealV1(request, context);
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