import { Injectable } from '@nestjs/common';
import { NamedMeal } from '@mealz/backend-meals-named-service-api';

import { NamedMealDBEntity } from '../entities';

@Injectable()
export class NamedMealDBMapper {
  public toEntity(namedMeal: NamedMeal): NamedMealDBEntity {
    return {
      id: namedMeal.id,
      user_id: namedMeal.userId,
      meal_name: namedMeal.mealName,
      meal_id: namedMeal.mealId,
    };
  }

  public fromEntity(
    entity: NamedMealDBEntity | undefined,
  ): NamedMeal | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.user_id,
      mealName: entity.meal_name,
      mealId: entity.meal_id,
    }
  }

  public fromEntities(entities: NamedMealDBEntity[]): NamedMeal[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
