import { Injectable } from '@nestjs/common';
import { decode, encode } from '@msgpack/msgpack';
import { ifDefined } from '@mealz/backend-common';
import {
  AdHocIngredient,
  MealIngredient,
  Meal,
} from '@mealz/backend-meals-common';

import { AdHocIngredientV1, MealDetailsV1, MealIngredientV1 } from '../types';

@Injectable()
export class MealDetailsV1Mapper {
  private toAdHocIngredientV1(
    adHocIngredient?: AdHocIngredient,
  ): AdHocIngredientV1 {
    if (!adHocIngredient) {
      return;
    }
    return {
      name: adHocIngredient.name,
      caloriesPer100: adHocIngredient.caloriesPer100,
    }
  }

  private toIngredientV1(ingredient: MealIngredient): MealIngredientV1 {
    return {
      ...ifDefined<MealIngredientV1>(
        'ingredientId',
        ingredient.ingredientId,
      ),
      ...ifDefined<MealIngredientV1>(
        'adHocIngredient',
        this.toAdHocIngredientV1(ingredient.adHocIngredient),
      ),
      ...ifDefined<MealIngredientV1>(
        'enteredAmount',
        ingredient.enteredAmount,
      ),
    }
  }

  public toBuffer(meal: Meal): Buffer {
    const details: MealDetailsV1 = {
      ...ifDefined<MealDetailsV1>('calories', meal.calories),
      ingredients: meal.ingredients.map((ingredient) => {
        return this.toIngredientV1(ingredient);
      }),
    };
    const encoded = encode(details);
    return Buffer.from(encoded);
  }

  private fromAdHocIngredientV1(
    adHocIngredientV1?: AdHocIngredientV1,
  ): AdHocIngredient {
    if (!adHocIngredientV1) {
      return;
    }
    return {
      name: adHocIngredientV1.name,
      caloriesPer100: adHocIngredientV1.caloriesPer100,
    }
  }

  private fromMealIngredientV1(
    ingredientV1: MealIngredientV1,
  ): MealIngredient {
    return {
      ...ifDefined<MealIngredient>(
        'ingredientId',
        ingredientV1.ingredientId,
      ),
      ...ifDefined<MealIngredient>(
        'adHocIngredient',
        this.fromAdHocIngredientV1(ingredientV1.adHocIngredient),
      ),
      ...ifDefined<MealIngredient>(
        'enteredAmount',
        ingredientV1.enteredAmount,
      ),
    }
  }

  public fromBuffer(buffer: Buffer): Omit<Meal, 'id'> {
    const details = decode(buffer) as MealDetailsV1;
    return {
      ...ifDefined<Meal>('calories', details.calories),
      ingredients: details.ingredients.map((ingredient) => {
        return this.fromMealIngredientV1(ingredient);
      }),
    }
  }
}