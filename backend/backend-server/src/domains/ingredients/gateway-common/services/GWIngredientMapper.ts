import { Injectable } from '@nestjs/common';
import { InternalError, MealzError } from '@mealz/backend-common';
import {
  FactId,
  FactPer100,
  FactUnit,
  Ingredient,
  IngredientType,
  Product,
  UnitPer100,
} from '@mealz/backend-ingredients-common';
import {
  GWFactId,
  GWFactPer100,
  GWFactUnit,
  GWIngredient,
  GWIngredientType,
  GWProduct,
  GWUnitPer100,
} from '@mealz/backend-ingredients-gateway-api';

@Injectable()
export class GWIngredientMapper {
  private mapType(type: IngredientType): GWIngredientType {
    switch (type) {
      case IngredientType.Generic:
        return GWIngredientType.Generic;
      case IngredientType.Product:
        return GWIngredientType.Product;
    }
  }

  private mapUnitPer100(unit: UnitPer100): GWUnitPer100 {
    switch (unit) {
      case UnitPer100.Grams:
        return GWUnitPer100.Grams;
      case UnitPer100.Milliliters:
        return GWUnitPer100.Milliliters;
      default:
        throw new InternalError(
          `Unknown unit per 100 ${MealzError.quote(unit)}`
        );
    }
  }

  private mapFactId(id: FactId): GWFactId {
    switch (id) {
      case FactId.Calories:
        return GWFactId.Calories;
      case FactId.Carbs:
        return GWFactId.Carbs;
      case FactId.Sugars:
        return GWFactId.Sugars;
      case FactId.Protein:
        return GWFactId.Protein;
      case FactId.TotalFat:
        return GWFactId.TotalFat;
      case FactId.SaturatedFat:
        return GWFactId.SaturatedFat;
      case FactId.MonounsaturatedFat:
        return GWFactId.MonounsaturatedFat;
      case FactId.PolyunsaturatedFat:
        return GWFactId.PolyunsaturatedFat;
      default:
        throw new InternalError(`Unknown fact ${MealzError.quote(id)}`);
    }
  }

  private mapFactUnit(unit: FactUnit): GWFactUnit {
    switch (unit) {
      case FactUnit.Kcal:
        return GWFactUnit.Kcal;
      case FactUnit.Grams:
        return GWFactUnit.Grams;
      default:
        throw new InternalError(`Unknown fact unit ${MealzError.quote(unit)}`);
    }
  }

  private mapFact(fact: FactPer100): GWFactPer100 {
    return {
      id: this.mapFactId(fact.id),
      unit: this.mapFactUnit(fact.unit),
      amount: fact.amount,
    };
  }

  private mapProduct(product: Product): GWProduct {
    return {
      brand: product.brand,
    };
  }

  public fromIngredient(ingredient: Ingredient): GWIngredient {
    return {
      id: ingredient.id,
      name: ingredient.name,
      type: this.mapType(ingredient.type),
      unitPer100: this.mapUnitPer100(ingredient.unitPer100),
      factsPer100: ingredient.factsPer100.map(fact => this.mapFact(fact)),
      ...(ingredient.product
        ? { product: this.mapProduct(ingredient.product) }
        : {}
      ),
    };
  }
}