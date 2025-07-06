import { Injectable, OnModuleInit } from '@nestjs/common';
import * as protobufjs from 'protobufjs';
import { InternalError, MealzError } from '#mealz/backend-common';
import {
  IngredientDetailsVersion,
  Ingredient,
  loadIngredientDetailsV1Pb,
  IngredientDetailsV1PbMapper,
} from '#mealz/backend-ingredients-common';

import { IngredientDBEntity } from '../entities';

@Injectable()
export class IngredientDBMapper implements OnModuleInit {
  private detailsV1Pb: protobufjs.Type;

  public constructor(
    private readonly ingredientsDetailsV1PbMapper: IngredientDetailsV1PbMapper,
  ) {}

  public async onModuleInit(): Promise<void> {
    this.detailsV1Pb = loadIngredientDetailsV1Pb();
  }

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
      `${MealzError.quote(entity.detailsVersion.toString())}
    `);
  }

  private fromDetailsV1(entity: IngredientDBEntity): Ingredient {
    return {
      id: entity.id,
      ...this.ingredientsDetailsV1PbMapper.fromPb(entity.details),
    };
  }
}

