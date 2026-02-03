import { Service } from '@andcreations/common';
import {
  calculateFact,
  calculateAmount,
} from '@mealz/backend-ingredients-shared';

import { I18nService } from '../../i18n';
import {
  IngredientFacts,
  getCaloriesPer100,
  getFacts,
} from '../../ingredients';
import { INVALID_AMOUNT } from '../const';
import {
  CalculateAmountsResult,
  Macros,
  MealPlannerIngredient,
  MealSummaryResult,
} from '../types';
import { MealCalculatorTranslations } from './MealCalculator.translations';

@Service()
export class MealCalculator {
  public constructor(private readonly i18n: I18nService) {
  }

  private translate(key: string, ...values: string[]): string {
    return this.i18n.translate(MealCalculatorTranslations, key, ...values);
  }

  private isValidIngredient(ingredient: MealPlannerIngredient) {
    return !!ingredient.fullIngredient || !!ingredient.adHocIngredient;
  }

  private fromEnteredAmount(ingredient: MealPlannerIngredient): number {
    const amount = parseFloat(ingredient.enteredAmount);
    return !isNaN(amount) ? amount : INVALID_AMOUNT;
  }

  public getCaloriesPer100(
    ingredient: MealPlannerIngredient,
  ): number | undefined {
    if (ingredient.fullIngredient) {
      return getCaloriesPer100(ingredient.fullIngredient);
    }
    if (ingredient.adHocIngredient) {
      return ingredient.adHocIngredient.caloriesPer100;
    }
    return undefined;
  }

  /**
   * Amount calculation rules:
   * - All the ingredients with entered amount aren't changed no matter
   *   if the calories are passed or not (calculatedAmount = enteredAmount).
   *   That is, we don't change what the user entered.
   * - If the calories are given, the remaining calories are split evenly
   *   among the ingredients without amount. The amount is calculated based
   *   on the remaining calories per ingredient without amount.
   * - Error is returned when there is at least one ingredient without
   *   amount and the calories are not passed.
   * - Entries without either full or ad-hoc ingredients are passed to result.
   */
  public calculateAmounts(
    calories: number | undefined,
    ingredients: MealPlannerIngredient[],
  ): CalculateAmountsResult {
    const result: MealPlannerIngredient[] = ingredients.map(ingredient => {
      return Object.assign({}, ingredient);
    });
    const validIngredients = ingredients.filter(ingredient => {
      return this.isValidIngredient(ingredient);
    });

    // Return error if there is an ingredient without amount and the calories
    // are not given.
    const hasIngredientWithoutAmount = validIngredients.some(ingredient => {
      return (
        ingredient.enteredAmount == null ||
        ingredient.enteredAmount.length === 0
      );
    });
    if (!calories && hasIngredientWithoutAmount) {
      result.forEach(ingredient => {
        ingredient.calculatedAmount = this.fromEnteredAmount(ingredient);
      });
      return {
        error: this.translate('no-calories-no-amounts'),
        ingredients: result,
      };
    }

    let totalKnownCalories = 0;
    let missingAmountCount = 0;
    // calculate total known calories
    validIngredients.forEach(ingredient => {
      const amount = this.fromEnteredAmount(ingredient);
      if (amount === INVALID_AMOUNT) {
        missingAmountCount++;
        return;
      }

      const caloriesPer100 = this.getCaloriesPer100(ingredient);
      totalKnownCalories += calculateFact(amount, caloriesPer100);
    });

    const missingCalories = Math.max(0, calories - totalKnownCalories);
    const missingCaloriesPerIngredient = missingCalories / missingAmountCount;
    // calculate amounts
    result
      .filter(ingredient => this.isValidIngredient(ingredient))
      .forEach(ingredient => {
        const amount = this.fromEnteredAmount(ingredient);
        if (amount !== INVALID_AMOUNT) {
          ingredient.calculatedAmount = amount;
          return;
        }

        const caloriesPer100 = this.getCaloriesPer100(ingredient);
        ingredient.calculatedAmount = calculateAmount(
          missingCaloriesPerIngredient,
          caloriesPer100,
        );
      });
  
    return {
      error: null,
      ingredients: result,
    };
  }

  public calculateMacrosRates(
    carbs: number,
    protein: number,
    fat: number,
  ): Macros {
    const total = carbs + protein + fat;
    return {
      carbs: carbs / total,
      protein: protein / total,
      fat: fat / total,
    };
  }

  public calculateMacrosPercentages(
    carbs: number,
    protein: number,
    fat: number,
  ): Macros {
    const total = carbs + protein + fat;
    if (total === 0) {
      return {
        carbs: 0,
        protein: 0,
        fat: 0,
      };
    }
    const carbsPercent = carbs * 100 / total;
    const proteinPercent = protein * 100 / total;
    return {
      carbs: carbsPercent,
      protein: proteinPercent,
      fat: 100 - carbsPercent - proteinPercent,
    };
  }

  /**
   * Summarize rules:
   * - Facts other than calories are returned only if there are full ingredients.
   */
  public summarize(
    ingredients: MealPlannerIngredient[],
  ): MealSummaryResult {
    const summary: MealSummaryResult = {
      total: {
        calories: 0,
        carbs: 0,
        sugars: 0,
        protein: 0,
        totalFat: 0,
        saturatedFat: 0,
        monounsaturatedFat: 0,
        polyunsaturatedFat: 0,
        grams: 0,
      },
      hasFullIngredients: false,
      hasAdHocIngredients: false,
    };
    const validIngredients = ingredients.filter(ingredient => {
      return this.isValidIngredient(ingredient);
    });
    if (!validIngredients.length) {
      return summary;
    }

    // summarize
    validIngredients.forEach(ingredient => {
      const amount = ingredient.calculatedAmount;
      summary.total.grams += amount;

      // ad-hoc ingredient
      if (!!ingredient.adHocIngredient) {
        summary.total.calories += calculateFact(
          amount,
          ingredient.adHocIngredient.caloriesPer100,
        );
        if (ingredient.adHocIngredient.carbsPer100 !== undefined) { 
          summary.total.carbs += calculateFact(
            amount,
            ingredient.adHocIngredient.carbsPer100,
          );
        }
        if (ingredient.adHocIngredient.proteinPer100 !== undefined) {
          summary.total.protein += calculateFact(
            amount,
            ingredient.adHocIngredient.proteinPer100,
          );
        }
        if (ingredient.adHocIngredient.fatPer100 !== undefined) {
          summary.total.totalFat += calculateFact(
            amount,
            ingredient.adHocIngredient.fatPer100,
          );
        }
      }

      // full ingredient
      if (ingredient.fullIngredient) {
        const facts = getFacts(ingredient.fullIngredient);
        summary.total.calories += calculateFact(amount, facts.calories);

        const optionalFacts: Array<
          keyof Omit<IngredientFacts, 'calories'>
        > = [
          'carbs',
          'sugars',
          'protein',
          'totalFat',
          'monounsaturatedFat',
          'polyunsaturatedFat',
          'saturatedFat',
        ];
        optionalFacts.forEach(fact => {
          const factValue = calculateFact(amount, facts[fact]);
          summary.total[fact] = (summary.total[fact] || 0) + factValue;
        });
      }
    });

    return {
      ...summary,
      hasFullIngredients: validIngredients.some(ingredient => {
        return !!ingredient.fullIngredient;
      }),
      hasAdHocIngredients: validIngredients.some(ingredient => {
        return !!ingredient.adHocIngredient;
      }),
    };
  }
}