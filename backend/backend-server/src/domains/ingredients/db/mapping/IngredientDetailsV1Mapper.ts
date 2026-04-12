import { Injectable } from '@nestjs/common';
import { decode, encode } from '@mealz/backend-db';
import { InternalError } from '@mealz/backend-common';
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

export type IngredientForBuffer = Omit<Ingredient, 'id'>;

@Injectable()
export class IngredientDetailsV1Mapper {
  private fromTypeV1(type: IngredientTypeV1): IngredientType {
    switch (type) {
      case IngredientTypeV1.Generic:
        return IngredientType.Generic;
      case IngredientTypeV1.Product:
        return IngredientType.Product;
      default:
        throw new InternalError(`Unknown ingredient type ${type}`);
    }
  }

  private fromUnitPer100V1(unit: UnitPer100V1): UnitPer100 {
    switch (unit) {
      case UnitPer100V1.Grams:
        return UnitPer100.Grams;
      case UnitPer100V1.Milliliters:
        return UnitPer100.Milliliters;
      default:
        throw new InternalError(`Unknown per 100 unit ${unit}`);
    }
  }

  private fromFactIdV1(id: FactIdV1): FactId {
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

  private fromFactUnitV1(unit: FactUnitV1): FactUnit {
    switch (unit) {
      case FactUnitV1.Grams:
        return FactUnit.Grams;
      case FactUnitV1.Kcal:
        return FactUnit.Kcal;
      default:
        throw new InternalError(`Unknown fact unit ${unit}`);
    }
  }

  private fromProductV1(product: ProductV1): Product {
    return {
      brand: product.brand,
    };
  }

  private fromFactV1(fact: FactPer100V1): FactPer100 {
    return {
      id: this.fromFactIdV1(fact.id),
      unit: this.fromFactUnitV1(fact.unit),
      amount: fact.amount,
    };
  } 

  public fromBuffer(buffer: Buffer): IngredientForBuffer {
    const details = decode(buffer) as IngredientDetailsV1;
    return {
      name: details.name,
      type: this.fromTypeV1(details.type),
      unitPer100: this.fromUnitPer100V1(details.unitPer100),
      factsPer100: details.factsPer100.map(fact => this.fromFactV1(fact)),
      ...(details.product
        ? { product: this.fromProductV1(details.product) }
        : {}
      ),
      isHidden: details.isHidden,
    };
  }

  private toTypeV1(type: IngredientType): IngredientTypeV1 {
    switch (type) {
      case IngredientType.Generic:
        return IngredientTypeV1.Generic;
      case IngredientType.Product:
        return IngredientTypeV1.Product;
      default:
        throw new InternalError(`Unknown ingredient type ${type}`);
    }
  }

  private toUnitPer100V1(unit: UnitPer100): UnitPer100V1 {
    switch (unit) {
      case UnitPer100.Grams:
        return UnitPer100V1.Grams;
      case UnitPer100.Milliliters:
        return UnitPer100V1.Milliliters;
      default:
        throw new InternalError(`Unknown per 100 unit ${unit}`);
    }
  }

  private toFactIdV1(id: FactId): FactIdV1 {
    switch (id) {
      case FactId.Calories:
        return FactIdV1.Calories;
      case FactId.Carbs:
        return FactIdV1.Carbs;
      case FactId.Sugars:
        return FactIdV1.Sugars;
      case FactId.Protein:
        return FactIdV1.Protein;
      case FactId.TotalFat:
        return FactIdV1.TotalFat;
      case FactId.SaturatedFat:
        return FactIdV1.SaturatedFat;
      case FactId.MonounsaturatedFat:
        return FactIdV1.MonounsaturatedFat;
      case FactId.PolyunsaturatedFat:
        return FactIdV1.PolyunsaturatedFat;
      default:
        throw new InternalError(`Unknown fact identifier ${id}`);
    }
  }

  private toFactUnitV1(unit: FactUnit): FactUnitV1 {
    switch (unit) {
      case FactUnit.Grams:
        return FactUnitV1.Grams;
      case FactUnit.Kcal:
        return FactUnitV1.Kcal;
      default:
        throw new InternalError(`Unknown fact unit ${unit}`);
    }
  }

  private toProductV1(product: Product): ProductV1 {
    return {
      brand: product.brand,
    };
  }
  
  private toFactV1(fact: FactPer100): FactPer100V1 {
    return {
      id: this.toFactIdV1(fact.id),
      unit: this.toFactUnitV1(fact.unit),
      amount: fact.amount,
    };
  }

  public toBuffer(ingredient: IngredientForBuffer): Buffer {
    const details: IngredientDetailsV1 = {
      name: ingredient.name,
      type: this.toTypeV1(ingredient.type),
      unitPer100: this.toUnitPer100V1(ingredient.unitPer100),
      factsPer100: ingredient.factsPer100.map(fact => this.toFactV1(fact)),
      ...(ingredient.product
        ? { product: this.toProductV1(ingredient.product) }
        : {}
      ),
      isHidden: ingredient.isHidden,
    };
    return encode(details);
  }
}