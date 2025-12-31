import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { InternalError, MealzError } from '@mealz/backend-common';
import { GWMealMapper } from '@mealz/backend-meals-gateway-common';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import { 
  LogMealResponseStatusV1,
  MealLog,
} from '@mealz/backend-meals-log-service-api';
import { 
  LogMealGWResponseStatusV1,
  GWMealLog,
} from '@mealz/backend-meals-log-gateway-api';

@Injectable()
export class GWMealLogMapper {
  public constructor(
    private readonly gwMealMapper: GWMealMapper,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
  ) {}

  public fromStatus(
    status: LogMealResponseStatusV1,
  ): LogMealGWResponseStatusV1 {
    switch (status) {
      case LogMealResponseStatusV1.Created:
        return LogMealGWResponseStatusV1.Created;
      case LogMealResponseStatusV1.Updated:
        return LogMealGWResponseStatusV1.Updated;
    }
  }

  public async fromMealLogs(
    mealLogs: MealLog[],
    context: Context,
  ): Promise<GWMealLog[]> {
    const { meals } = await this.mealsCrudTransporter.readMealsByIdV1(
      {
        ids: mealLogs.map(mealLog => mealLog.mealId),
      },
      context,
    );
    return mealLogs.map((mealLog) => {
      const meal = meals.find(meal => meal.id === mealLog.mealId);
      if (!meal) {
        throw new InternalError(
          `Meal ${MealzError.quote(mealLog.mealId)} not found`
        );
      }
      return {
        id: mealLog.id,
        userId: mealLog.userId,
        mealId: mealLog.mealId,
        dailyPlanMealName: mealLog.dailyPlanMealName,
        loggedAt: mealLog.loggedAt,
        meal: this.gwMealMapper.fromMeal(meal),
      };
    });
  }
}