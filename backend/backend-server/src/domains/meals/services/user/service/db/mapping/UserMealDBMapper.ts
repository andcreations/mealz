import { Injectable } from '@nestjs/common';
import { decode, encode } from '@mealz/backend-db';
import { mapIfDefined } from '@mealz/backend-shared';
import { UserMeal } from '@mealz/backend-meals-user-service-api';

import { UserMealDBEntity } from '../entities';

@Injectable()
export class UserMealDBMapper {
  public toEntity(
    userMeal: Omit<UserMeal, 'createdAt'>,
  ): Omit<UserMealDBEntity, 'created_at'> {
    return {
      id: userMeal.id,
      user_id: userMeal.userId,
      meal_id: userMeal.mealId,
      type_id: userMeal.typeId,
      ...mapIfDefined<UserMealDBEntity>(
        'metadata',
        userMeal.metadata,
        (metadata) => Buffer.from(encode(metadata)),
      ),
    };
  }

  public fromEntity(
    entity: UserMealDBEntity | undefined,
  ): UserMeal | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.user_id,
      mealId: entity.meal_id,
      typeId: entity.type_id,
      ...mapIfDefined<UserMeal>(
        'metadata',
        entity.metadata,
        (metadata) => decode(metadata),
      ),
      createdAt: entity.created_at,
    }
  }
}
