import { Injectable } from '@nestjs/common';
import { ifDefined } from '@mealz/backend-shared';
import {
  AdHocIngredient,
  MealIngredient,
  Meal,
  MealWithoutId,
} from '@mealz/backend-meals-common';
import {
  GWAdHocIngredient,
  GWMealIngredient,
  GWMeal,
  GWMealWithoutId,
} from '@mealz/backend-meals-gateway-api';

@Injectable()
export class GWMealMapper {
  private fromAdHocIngredient(
    adHocIngredient?: AdHocIngredient
  ): GWAdHocIngredient | undefined {
    if (!adHocIngredient) {
      return;
    }
    return {
      name: adHocIngredient.name,
      caloriesPer100: adHocIngredient.caloriesPer100,
      carbsPer100: adHocIngredient.carbsPer100,
      proteinPer100: adHocIngredient.proteinPer100,
      fatPer100: adHocIngredient.fatPer100,
    };
  }

  private fromMealIngredient(mealIngredient: MealIngredient): GWMealIngredient {
    return {
      ...ifDefined<GWMealIngredient>(
        'ingredientId',
        mealIngredient.ingredientId,
      ),
      ...ifDefined<GWMealIngredient>(
        'adHocIngredient',
        this.fromAdHocIngredient(mealIngredient.adHocIngredient),
      ),
      ...ifDefined<GWMealIngredient>(
        'enteredAmount',
        mealIngredient.enteredAmount,
      ),
    }
  }

  public fromMeal(meal: Meal): GWMeal {
    return {
      id: meal.id,
      ingredients: meal.ingredients.map(mealIngredient => {
        return this.fromMealIngredient(mealIngredient);
      }),
      ...ifDefined<GWMeal>('calories', meal.calories),
    }
  }

  private toAdHocIngredient(
    gwAdHocIngredient?: GWAdHocIngredient,
  ): AdHocIngredient {
    if (!gwAdHocIngredient) {
      return;
    }
    return {
      name: gwAdHocIngredient.name,
      caloriesPer100: gwAdHocIngredient.caloriesPer100,
      carbsPer100: gwAdHocIngredient.carbsPer100,
      proteinPer100: gwAdHocIngredient.proteinPer100,
      fatPer100: gwAdHocIngredient.fatPer100,
    }
  }

  private toMealIngredient(gwMealIngredient: GWMealIngredient): MealIngredient {
    return {
      ...ifDefined<MealIngredient>(
        'ingredientId',
        gwMealIngredient.ingredientId,
      ),
      ...ifDefined<MealIngredient>(
        'adHocIngredient',
        this.toAdHocIngredient(gwMealIngredient.adHocIngredient),
      ),
      ...ifDefined<MealIngredient>(
        'enteredAmount',
        gwMealIngredient.enteredAmount,
      ),
    }
  }

  public toMeal(gwMeal: GWMeal): Meal {
    return {
      id: gwMeal.id,
      ingredients: gwMeal.ingredients.map(gwMealIngredient => {
        return this.toMealIngredient(gwMealIngredient);
      }),
      ...ifDefined<Meal>('calories', gwMeal.calories),
    }
  }

  public toMealWithoutId(gwMeal: GWMealWithoutId): MealWithoutId {
    return {
      ingredients: gwMeal.ingredients.map(gwMealIngredient => {
        return this.toMealIngredient(gwMealIngredient);
      }),
      ...ifDefined<Meal>('calories', gwMeal.calories),
    }
  }
}