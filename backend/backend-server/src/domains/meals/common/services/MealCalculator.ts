import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { InternalError } from '@mealz/backend-common';
import { 
  FactId,
  getCaloriesPer100,
  getFactAmount,
} from '@mealz/backend-ingredients-common';
import {
  calculateAmount,
  calculateFact,
} from '@mealz/backend-ingredients-shared';
import {
  IngredientsCrudTransporter,
} from '@mealz/backend-ingredients-crud-service-api';

import { INVALID_AMOUNT } from '../consts';
import { 
  MealWithoutId,
  MealIngredient,
  CalculateAmountsResult,
  MealTotals,
} from '../types';

@Injectable()
export class MealCalculator {
  public constructor(
    private readonly ingredientsCrudTransporter: IngredientsCrudTransporter,
  ) {}

  private fromEnteredAmount(ingredient: MealIngredient): number {
    const amount = parseFloat(ingredient.enteredAmount);
    return !isNaN(amount) ? amount : INVALID_AMOUNT;
  }

  /**
   * Amounts can be calculated if all the ingredients are given and
   * the calories are passed. Amounts without entered amount can be
   * calculated if the calories are passed.
   */
  public canCalculateAmounts(meal: MealWithoutId): {
    reason: string | undefined,
    canCalculate: boolean,
  } {
    let reason: string | undefined;
    const pushReason = (newReason: string) => {
      if (!reason) {
        reason = '';
      }
      reason += reason ? ' | ' : '';
      reason += newReason;
    };

    const hasInvalidIngredients = meal.ingredients.some(ingredient => {
      return (
        ingredient.ingredientId == null &&
        ingredient.adHocIngredient == null
      );
    });
    if (hasInvalidIngredients) {
      pushReason('Invalid ingredients');
    }

    const hasInvalidAmounts = meal.ingredients.some(ingredient => {
      return this.fromEnteredAmount(ingredient) === INVALID_AMOUNT;
    });
    const hasCalories = meal.calories != null;
    if (hasInvalidAmounts && !hasCalories) {
      pushReason('Invalid amounts and no calories');
    }

    return {
      reason,
      canCalculate: !reason,
    };
  }

  /**
   * Amount calculation rules:
   * - All the ingredients with entered amount aren't changed no matter
   *   if the calories are passed or not (calculatedAmount = enteredAmount).
   *   That is, we don't change what the user entered.
   * - The remaining calories are split evenly among the ingredients without
   *   amount. The amount is calculated based on the remaining calories per
   *   ingredient without amount.
   * - Error is thrown when there is at least one ingredient without
   *   amount and the calories are not passed.
   */
  public async calculateAmounts(
    meal: MealWithoutId,
    context: Context,
  ): Promise<CalculateAmountsResult> {
    const { reason, canCalculate } = this.canCalculateAmounts(meal);
    if (!canCalculate) {
      throw new InternalError(
        `Cannot calculate amounts for the meal: ${reason}`
      );
    }

    const ingredientIds = meal.ingredients
      .filter(ingredient => ingredient.ingredientId != null)
      .map(ingredient => ingredient.ingredientId);

    // read ingredients
    const { ingredients } = ingredientIds.length > 0
      ? await this.ingredientsCrudTransporter.readIngredientsByIdV1(
          {
            ids: ingredientIds,
          },
          context,
        )
      : { ingredients: [] };

    const getMealIngredientCaloriesPer100 = (
      mealIngredient: MealIngredient
    ): number | undefined => {
      // full ingredient
      if (mealIngredient.ingredientId) {
        const ingredient = ingredients.find(ingredient => {
          return ingredient.id === mealIngredient.ingredientId;
        });
        return getCaloriesPer100(ingredient);
      }

      // ad-hoc ingredient
      if (mealIngredient.adHocIngredient) {
        return mealIngredient.adHocIngredient.caloriesPer100;
      }

      throw new InternalError('Missing ingredient during amount calculation');
    };

    let totalKnownCalories = 0;
    let missingAmountCount = 0;
    // calculate total known calories
    meal.ingredients.forEach(ingredient => {
      const amount = this.fromEnteredAmount(ingredient);
      if (amount === INVALID_AMOUNT) {
        missingAmountCount++;
        return;
      }

      const caloriesPer100 = getMealIngredientCaloriesPer100(ingredient);
      totalKnownCalories += calculateFact(amount, caloriesPer100);
    });

    const missingCalories = Math.max(0, meal.calories - totalKnownCalories);
    const missingCaloriesPerIngredient = missingCalories / missingAmountCount;
    // calculate amounts
    const newIngredients = meal.ingredients.map(ingredient => {
      const amount = this.fromEnteredAmount(ingredient);
      if (amount !== INVALID_AMOUNT) {
        return {
          ...ingredient,
          calculatedAmount: amount,
        };
      }

      const caloriesPer100 = getMealIngredientCaloriesPer100(ingredient);
      const calculatedAmount = calculateAmount(
        missingCaloriesPerIngredient,
        caloriesPer100,
      );

      return {
        ...ingredient,
        calculatedAmount,
      }
    });

    // calculate totals
    const totals: MealTotals = {
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    };
    let hasTotalCalories = false;
    let hasTotalCarbs = false;
    let hasTotalFat = false;
    let hasTotalProtein = false;
    for (const newIngredient of newIngredients) {
      // ad-hoc ingredient
      if (newIngredient.adHocIngredient) {
        totals.calories += calculateFact(
          newIngredient.calculatedAmount,
          newIngredient.adHocIngredient.caloriesPer100,
        );
        hasTotalCalories = true;

        if (newIngredient.adHocIngredient.carbsPer100 !== undefined) {
          totals.carbs += calculateFact(
            newIngredient.calculatedAmount,
            newIngredient.adHocIngredient.carbsPer100,
          );
          hasTotalCarbs = true;
        }

        if (newIngredient.adHocIngredient.proteinPer100 !== undefined) {
          totals.protein += calculateFact(
            newIngredient.calculatedAmount,
            newIngredient.adHocIngredient.proteinPer100,
          );
          hasTotalProtein = true;
        }

        if (newIngredient.adHocIngredient.fatPer100 !== undefined) {
          totals.fat += calculateFact(
            newIngredient.calculatedAmount,
            newIngredient.adHocIngredient.fatPer100,
          );
          hasTotalFat = true;
        }

        continue;
      }

      // full ingredient
      const ingredient = ingredients.find(ingredient => {
        return ingredient.id === newIngredient.ingredientId;
      });
      if (!ingredient) {
        continue;
      }

      const calories = getFactAmount(ingredient, FactId.Calories);
      if (calories != null) {
        totals.calories += calculateFact(
          newIngredient.calculatedAmount,
          calories,
        );
        hasTotalCalories = true;
      }

      const carbs = getFactAmount(ingredient, FactId.Carbs);
      if (carbs != null) {
        totals.carbs += calculateFact(
          newIngredient.calculatedAmount,
          carbs,
        );
        hasTotalCarbs = true;
      }

      const fat = getFactAmount(ingredient, FactId.TotalFat);
      if (fat != null) {
        totals.fat += calculateFact(
          newIngredient.calculatedAmount,
          fat,
        );
        hasTotalFat = true;
      }

      const protein = getFactAmount(ingredient, FactId.Protein);
      if (protein != null) {
        totals.protein += calculateFact(
          newIngredient.calculatedAmount,
          protein,
        );
        hasTotalProtein = true;
      }
    }
    if (!hasTotalCalories) {
      delete totals.calories;
    }
    if (!hasTotalCarbs) {
      delete totals.carbs;
    }
    if (!hasTotalFat) {
      delete totals.fat;
    }
    if (!hasTotalProtein) {
      delete totals.protein;
    }

    return {
      meal: {
        ...meal,
        ingredients: newIngredients,
      },
      ingredients,
      totals,
    };
  }
}
