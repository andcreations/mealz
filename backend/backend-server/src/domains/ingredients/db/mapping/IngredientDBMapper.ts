import { Injectable } from '@nestjs/common';
import { InternalError, MealzError } from '@mealz/backend-common';
import { Ingredient } from '@mealz/backend-ingredients-common';

import { IngredientDetailsVersion } from '../types';
import { IngredientDBEntity } from '../entities';
import { IngredientDetailsV1Mapper } from './IngredientDetailsV1Mapper';

@Injectable()
export class IngredientDBMapper {
  public constructor(
    private readonly ingredientDetailsV1Mapper: IngredientDetailsV1Mapper,
  ) {}

  public fromEntity(
    entity: IngredientDBEntity | undefined,
  ): Ingredient | undefined {
    if (!entity) {
      return undefined;
    }
    if (entity.detailsVersion === IngredientDetailsVersion.V1) {
      return this.fromDetailsV1(entity);
    }

    throw new InternalError(
      `Unknown ingredient details version ` +
      `${MealzError.quote(entity.detailsVersion.toString())}`
    );
  }

  private fromDetailsV1(entity: IngredientDBEntity): Ingredient {
    return {
      id: entity.id,
      ...this.ingredientDetailsV1Mapper.fromBuffer(entity.details),
    };
  }
}

