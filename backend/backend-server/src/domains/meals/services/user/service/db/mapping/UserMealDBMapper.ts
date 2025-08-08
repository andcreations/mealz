import { Injectable } from '@nestjs/common';
import { UserMeal } from '@mealz/backend-meals-user-service-api';

import { UserMealDBEntity } from '../entities';

@Injectable()
export class UserMealDBMapper {
  public toEntity(userMeal: UserMeal): UserMealDBEntity {
    return {
      id: userMeal.id,
      userId: userMeal.userId,
      mealId: userMeal.mealId,
      type: userMeal.type,
    };
  }

  public fromEntity(entity: UserMealDBEntity | undefined): UserMeal | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.userId,
      mealId: entity.mealId,
      type: entity.type,
    }
  }
}
