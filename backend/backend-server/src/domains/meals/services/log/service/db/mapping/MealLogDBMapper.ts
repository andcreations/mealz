import { Injectable } from '@nestjs/common';
import { MealLog } from '@mealz/backend-meals-log-service-api';

import { MealLogDBEntity } from '../entities';

@Injectable()
export class MealLogDBMapper {
  public toEntity(userMeal: MealLog): MealLogDBEntity {
    return {
      id: userMeal.id,
      userId: userMeal.userId,
      mealId: userMeal.mealId,
      loggedAt: userMeal.loggedAt,
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
      loggedAt: entity.loggedAt,
    }
  }
}
