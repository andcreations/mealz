import { Injectable } from '@nestjs/common';
import { decode, encode } from '@msgpack/msgpack';
import { mapIfDefined } from '@mealz/backend-shared';
import { UserMeal } from '@mealz/backend-meals-user-service-api';

import { UserMealDBEntity } from '../entities';

@Injectable()
export class UserMealDBMapper {
  public toEntity(userMeal: UserMeal): UserMealDBEntity {
    return {
      id: userMeal.id,
      userId: userMeal.userId,
      mealId: userMeal.mealId,
      typeId: userMeal.typeId,
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
      userId: entity.userId,
      mealId: entity.mealId,
      typeId: entity.typeId,
      ...mapIfDefined<UserMeal>(
        'metadata',
        entity.metadata,
        (metadata) => decode(metadata),
      ),
    }
  }
}
