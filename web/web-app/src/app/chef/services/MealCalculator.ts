import { Service } from '@andcreations/common';

import {
  CalculateAmountsResult,
  MealPlannerIngredient,
  MealSummaryResult,
} from '../types';
import { I18nService } from '../../i18n';
import { IngredientFacts } from '../../ingredients/types';
import {
  calculateAmount,
  calculateFact,
  getCaloriesPer100,
  getFacts,
} from '../../ingredients/utils';
import { INVALID_AMOUNT } from '../const';
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

  private getCaloriesPer100(ingredient: MealPlannerIngredient): number {
    if (ingredient.fullIngredient) {
      return getCaloriesPer100(ingredient.fullIngredient);
    }
    if (ingredient.adHocIngredient) {
      return ingredient.adHocIngredient.caloriesPer100;
    }
    // This should never happen.
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

  /**
   * Summarize rules:
   * - The optional facts are returned only when all the ingredients are full.
   */
  public summarize(
    ingredients: MealPlannerIngredient[],
  ): MealSummaryResult {
    const summary: MealSummaryResult = {
      total: {
        calories: 0,
      },
      hasOptionalFacts: false,
    };
    const validIngredients = ingredients.filter(ingredient => {
      return this.isValidIngredient(ingredient);
    });
    if (!validIngredients.length) {
      return summary;
    }
    const hasOnlyFullIngredients = validIngredients.every(ingredient => {
      return !!ingredient.fullIngredient;
    });

    // summarize
    validIngredients.forEach(ingredient => {
      const amount = ingredient.calculatedAmount;

      // ad-hoc ingredient
      if (!!ingredient.adHocIngredient) {
        summary.total.calories += calculateFact(
          amount,
          ingredient.adHocIngredient.caloriesPer100,
        );
      }

      // full ingredient
      if (ingredient.fullIngredient) {
        const facts = getFacts(ingredient.fullIngredient);
        summary.total.calories += calculateFact(amount, facts.calories);

        // The optional facts are calculated only if all the ingredients
        // are full ingredients. We have only calories for the ad-hoc ones.
        if (hasOnlyFullIngredients) {
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
      }
    });

    return {
      ...summary,
      hasOptionalFacts: hasOnlyFullIngredients,
    };
  }
}