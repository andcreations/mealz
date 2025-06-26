import { Injectable, OnModuleInit } from '@nestjs/common';
import * as protobufjs from 'protobufjs';
import { InternalError, MealzError } from '#mealz/backend-common';
import {
  loadIngredientDetailsV1Pb,
  IngredientDetailsVersion,
  Ingredient,
} from '#mealz/backend-ingredients-common';

import { IngredientDBEntity } from '../entities';

@Injectable()
export class IngredientDBMapper implements OnModuleInit {
  private detailsV1Pb: protobufjs.Type;

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
    const detailsPb = this.detailsV1Pb.decode(entity.details);
    const details = this.detailsV1Pb.toObject(detailsPb);

    const fromFactPb = (fact: any) => ({
      id: fact.id,
      unit: fact.unit,
      amount: fact.amount,
    });
    const fromProductPb = (product: any) => ({
      brand: product.brand,
    });

    return {
      id: entity.id,
      name: details.name,
      type: details.type,
      facts: details.facts.map(fromFactPb),
      ...(details.product ? { product: fromProductPb(details.product) } : {}),
    }
  }
}

