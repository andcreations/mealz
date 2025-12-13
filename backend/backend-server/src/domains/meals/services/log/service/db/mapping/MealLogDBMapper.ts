import { Injectable } from '@nestjs/common';
import { MealLog } from '@mealz/backend-meals-log-service-api';

import { MealLogDBEntity } from '../entities';

@Injectable()
export class MealLogDBMapper {
  public toEntity(mealLog: MealLog): MealLogDBEntity {
    return {
      id: mealLog.id,
      user_id: mealLog.userId,
      meal_id: mealLog.mealId,
      daily_plan_meal_name: mealLog.dailyPlanMealName,
      logged_at: mealLog.loggedAt,
    };
  }

  public fromEntity(entity: MealLogDBEntity | undefined): MealLog | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.user_id,
      mealId: entity.meal_id,
      dailyPlanMealName: entity.daily_plan_meal_name,
      loggedAt: entity.logged_at,
    }
  }
}
