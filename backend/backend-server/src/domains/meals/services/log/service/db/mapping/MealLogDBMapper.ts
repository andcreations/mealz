import { Injectable } from '@nestjs/common';
import { MealLog } from '@mealz/backend-meals-log-service-api';

import { MealLogDBEntity } from '../entities';

@Injectable()
export class MealLogDBMapper {
  public toEntity(mealLog: MealLog): MealLogDBEntity {
    return {
      id: mealLog.id,
      userId: mealLog.userId,
      mealId: mealLog.mealId,
      dailyPlanMealName: mealLog.dailyPlanMealName,
      loggedAt: mealLog.loggedAt,
    };
  }

  public fromEntity(entity: MealLogDBEntity | undefined): MealLog | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.userId,
      mealId: entity.mealId,
      dailyPlanMealName: entity.dailyPlanMealName,
      loggedAt: entity.loggedAt,
    }
  }
}
