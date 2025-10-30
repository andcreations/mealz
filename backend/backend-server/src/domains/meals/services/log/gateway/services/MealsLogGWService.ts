import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  LogMealRequestV1,
  MealsLogTransporter,
} from '@mealz/backend-meals-log-service-api';
import { LogMealGWRequestV1 } from '@mealz/backend-meals-log-gateway-api';

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
}