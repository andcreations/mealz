import { Injectable } from '@nestjs/common';
import { ifDefined } from '@mealz/backend-shared';
import { 
  BadRequestError,
  InternalError,
  MealzError,
} from '@mealz/backend-common';
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
import { UpsertObject } from '@mealz/backend-db';

@Injectable()
export class GWIngredientMapper {
  private fromType(type: IngredientType): GWIngredientType {
    switch (type) {
      case IngredientType.Generic:
        return GWIngredientType.Generic;
      case IngredientType.Product:
        return GWIngredientType.Product;
    }
  }

  private fromUnitPer100(unit: UnitPer100): GWUnitPer100 {
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

  private fromFactId(id: FactId): GWFactId {
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

  private fromFactUnit(unit: FactUnit): GWFactUnit {
    switch (unit) {
      case FactUnit.Kcal:
        return GWFactUnit.Kcal;
      case FactUnit.Grams:
        return GWFactUnit.Grams;
      default:
        throw new InternalError(`Unknown fact unit ${MealzError.quote(unit)}`);
    }
  }

  private fromFact(fact: FactPer100): GWFactPer100 {
    return {
      id: this.fromFactId(fact.id),
      unit: this.fromFactUnit(fact.unit),
      amount: fact.amount,
    };
  }

  private fromProduct(product?: Product): GWProduct | undefined {
    if (!product) {
      return;
    }
    return {
      brand: product.brand,
    };
  }

  public fromIngredient(ingredient: Ingredient): GWIngredient {
    return {
      id: ingredient.id,
      name: ingredient.name,
      type: this.fromType(ingredient.type),
      unitPer100: this.fromUnitPer100(ingredient.unitPer100),
      factsPer100: ingredient.factsPer100.map(fact => this.fromFact(fact)),
      ...ifDefined<GWIngredient>(
        'product',
        this.fromProduct(ingredient.product),
      ),
      isHidden: ingredient.isHidden,
    };
  }

  private toType(type: GWIngredientType): IngredientType {
    switch (type) {
      case GWIngredientType.Generic:
        return IngredientType.Generic;
      case GWIngredientType.Product:
        return IngredientType.Product;
      default:
        throw new BadRequestError(
          `Unknown ingredient type ${MealzError.quote(type)}`
        );
    }
  }

  private toUnitPer100(unit: GWUnitPer100): UnitPer100 {
    switch (unit) {
      case GWUnitPer100.Grams:
        return UnitPer100.Grams;
      case GWUnitPer100.Milliliters:
        return UnitPer100.Milliliters;
      default:
        throw new BadRequestError(
          `Unknown unit per 100 ${MealzError.quote(unit)}`
        );
    }
  }


  private toFactId(id: GWFactId): FactId {
    switch (id) {
      case GWFactId.Calories:
        return FactId.Calories;
      case GWFactId.Carbs:
        return FactId.Carbs;
      case GWFactId.Sugars:
        return FactId.Sugars;
      case GWFactId.Protein:
        return FactId.Protein;
      case GWFactId.TotalFat:
        return FactId.TotalFat;
      case GWFactId.SaturatedFat:
        return FactId.SaturatedFat;
      case GWFactId.MonounsaturatedFat:
        return FactId.MonounsaturatedFat;
      case GWFactId.PolyunsaturatedFat:
        return FactId.PolyunsaturatedFat;
      default:
        throw new BadRequestError(`Unknown fact ${MealzError.quote(id)}`);
    }
  }

  private toFactUnit(unit: GWFactUnit): FactUnit {
    switch (unit) {
      case GWFactUnit.Kcal:
        return FactUnit.Kcal;
      case GWFactUnit.Grams:
        return FactUnit.Grams;
      default:
        throw new BadRequestError(`Unknown fact unit ${MealzError.quote(unit)}`);
    }
  }

  private toFact(fact: GWFactPer100): FactPer100 {
    return {
      id: this.toFactId(fact.id),
      unit: this.toFactUnit(fact.unit),
      amount: fact.amount,
    };
  }

  private toProduct(product?: GWProduct): Product | undefined {
    if (!product) {
      return;
    }
    return {
      brand: product.brand,
    };
  }

  public toIngredient(
    ingredient: UpsertObject<GWIngredient, 'id'>
  ): UpsertObject<Ingredient, 'id'> {
    return {
      ...ifDefined<UpsertObject<Ingredient, 'id'>, string>(
        'id',
        ingredient.id,
      ),
      name: ingredient.name,
      type: this.toType(ingredient.type),
      unitPer100: this.toUnitPer100(ingredient.unitPer100),
      factsPer100: ingredient.factsPer100.map(fact => this.toFact(fact)),
      ...ifDefined<UpsertObject<Ingredient, 'id'>, Product>(
        'product',
        this.toProduct(ingredient.product),
      ),
      isHidden: ingredient.isHidden,
    };
  }
}