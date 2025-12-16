import { Injectable } from '@nestjs/common';
import { InternalError, MealzError } from '@mealz/backend-common';
import { Meal } from '@mealz/backend-meals-common';

import { MealDBEntity } from '../entities';
import { MealDetailsVersion } from '../types';
import { MealDetailsV1Mapper } from './MealDetailsV1Mapper';

@Injectable()
export class MealDBMapper {
  public constructor(
    private readonly mealDetailsV1Mapper: MealDetailsV1Mapper,
  ) {}

  public toEntity(meal: Meal): MealDBEntity {
    return {
      id: meal.id,
      details_version: MealDetailsVersion.V1,
      details: this.mealDetailsV1Mapper.toBuffer(meal),
    };
  }

  public fromEntity(entity: MealDBEntity | undefined): Meal | undefined {
    if (!entity) {
      return undefined;
    }
    if (entity.details_version === MealDetailsVersion.V1) {
      return this.fromDetailsV1(entity);
    }

    throw new InternalError(
      `Unknown ingredient details version ` +
      `${MealzError.quote(entity.details_version.toString())}`
    );
  }

  private fromDetailsV1(entity: MealDBEntity): Meal {
    return {
      id: entity.id,
      ...this.mealDetailsV1Mapper.fromBuffer(entity.details),
    }
  }

  public fromEntities(entities: MealDBEntity[]): Meal[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
