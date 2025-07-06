import { Injectable, OnModuleInit } from '@nestjs/common';
import * as protobufjs from 'protobufjs';
import { InternalError, MealzError } from '#mealz/backend-common';

import {
  FactIdV1Pb,
  FactPer100V1Pb,
  FactUnitV1Pb,
  ProductV1Pb,
  IngredientTypeV1Pb,
  IngredientDetailsV1Pb,
  loadIngredientDetailsV1Pb,
} from '../protobuf';
import { 
  FactId,
  FactPer100,
  FactUnit,
  Product,
  IngredientType,
  Ingredient,
} from '../types';

@Injectable()
export class IngredientDetailsV1PbMapper implements OnModuleInit {
  private detailsV1Pb: protobufjs.Type;

  public async onModuleInit(): Promise<void> {
    this.detailsV1Pb = loadIngredientDetailsV1Pb();
  }  

  private fromFactIdPb(id: FactIdV1Pb): FactId {
    switch (id) {
      case FactIdV1Pb.CALORIES:
        return FactId.Calories;
      case FactIdV1Pb.CARBS:
        return FactId.Carbs;
      case FactIdV1Pb.SUGARS:
        return FactId.Sugars;
      case FactIdV1Pb.PROTEIN:
        return FactId.Protein;
      case FactIdV1Pb.TOTAL_FAT:
        return FactId.TotalFat;
      case FactIdV1Pb.SATURATED_FAT:
        return FactId.SaturatedFat;
      case FactIdV1Pb.MONOUNSATURATED_FAT:
        return FactId.MonounsaturatedFat;
      case FactIdV1Pb.POLYUNSATURATED_FAT:
        return FactId.PolyunsaturatedFat;
      case FactIdV1Pb.TRANS_FAT:
        return FactId.TransFat;
      default:
        throw new InternalError(
          `Unknown protobuf fact identifier ` +
          `${MealzError.quote(id)}`
        );
    }
  };

  private fromFactUnitPb(unit: FactUnitV1Pb): FactUnit {
    switch (unit) {
      case FactUnitV1Pb.KCAL:
        return FactUnit.Kcal;
      case FactUnitV1Pb.GRAMS:
        return FactUnit.Grams;
      default:
        throw new InternalError(
          `Unknown protobuf fact unit ` +
          `${MealzError.quote(unit)}`
        );
    }
  };

  private fromFactPb(fact: FactPer100V1Pb): FactPer100 {
    return {
      id: this.fromFactIdPb(fact.id),
      unit: this.fromFactUnitPb(fact.unit),
      amount: fact.amount,
    };
  }

  private fromProductPb(product: ProductV1Pb): Product {
    return {
      brand: product.brand,
    };
  }

  private fromIngredientTypePb(type: IngredientTypeV1Pb): IngredientType {
    switch (type) {
      case IngredientTypeV1Pb.GENERIC:
        return IngredientType.Generic;
      case IngredientTypeV1Pb.PRODUCT:
        return IngredientType.Product;
      default:
        throw new InternalError(
          `Unknown protobuf ingredient type ` +
          `${MealzError.quote(type)}`
        );
    }
  };  

  public fromPb(buffer: Buffer): Omit<Ingredient, 'id'> { 
    const pb = this.detailsV1Pb.decode(buffer);
    const details = this.detailsV1Pb.toObject(pb) as IngredientDetailsV1Pb;

    return {
      name: details.name,
      type: this.fromIngredientTypePb(details.type),
      facts: details.facts.map(fact => this.fromFactPb(fact)),
      ...(details.product
        ? { product: this.fromProductPb(details.product) }
        : {}
      ),
    }      
  }
}