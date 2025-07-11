import { Injectable } from '@nestjs/common';
import { decode } from '@msgpack/msgpack';
import {
  FactId,
  FactPer100,
  FactUnit,
  Product,
  Ingredient,
  IngredientType,
  UnitPer100,
} from '@mealz/backend-ingredients-common';
import {
  FactIdV1,
  FactUnitV1,
  FactPer100V1,
  ProductV1,
  IngredientTypeV1,
  IngredientDetailsV1,
  UnitPer100V1,
} from '@mealz/backend-ingredients-db';
import { InternalError } from '../../../../common';

@Injectable()
export class IngredientDetailsV1Mapper {
  private mapType(type: IngredientTypeV1): IngredientType {
    switch (type) {
      case IngredientTypeV1.Generic:
        return IngredientType.Generic;
      case IngredientTypeV1.Product:
        return IngredientType.Product;
      default:
        throw new InternalError(`Unknown ingredient type ${type}`);
    }
  }

  private mapUnitPer100(unit: UnitPer100V1): UnitPer100 {
    switch (unit) {
      case UnitPer100V1.Grams:
        return UnitPer100.Grams;
      case UnitPer100V1.Milliliters:
        return UnitPer100.Milliliters;
      default:
        throw new InternalError(`Unknown per 100 unit ${unit}`);
    }
  }

  private mapFactId(id: FactIdV1): FactId {
    switch (id) {
      case FactIdV1.Calories:
        return FactId.Calories;
      case FactIdV1.Carbs:
        return FactId.Carbs;
      case FactIdV1.Sugars:
        return FactId.Sugars;
      case FactIdV1.Protein:
        return FactId.Protein;
      case FactIdV1.TotalFat:
        return FactId.TotalFat;
      case FactIdV1.SaturatedFat:
        return FactId.SaturatedFat;
      case FactIdV1.MonounsaturatedFat:
        return FactId.MonounsaturatedFat;
      case FactIdV1.PolyunsaturatedFat:
        return FactId.PolyunsaturatedFat;
      default:
        throw new InternalError(`Unknown fact identifier ${id}`);
    }
  }

  private mapFactUnit(unit: FactUnitV1): FactUnit {
    switch (unit) {
      case FactUnitV1.Grams:
        return FactUnit.Grams;
      case FactUnitV1.Kcal:
        return FactUnit.Kcal;
      default:
        throw new InternalError(`Unknown fact unit ${unit}`);
    }
  }

  private mapProduct(product: ProductV1): Product {
    return {
      brand: product.brand,
    };
  }

  private mapFact(fact: FactPer100V1): FactPer100 {
    return {
      id: this.mapFactId(fact.id),
      unit: this.mapFactUnit(fact.unit),
      amount: fact.amount,
    };
  } 

  public fromBuffer(buffer: Buffer): Omit<Ingredient, 'id'> {
    const details = decode(buffer) as IngredientDetailsV1;
    return {
      name: details.name,
      type: this.mapType(details.type),
      unitPer100: this.mapUnitPer100(details.unitPer100),
      factsPer100: details.factsPer100.map(fact => this.mapFact(fact)),
      ...(details.product
        ? { product: this.mapProduct(details.product) }
        : {}
      ),
    };
  }
}