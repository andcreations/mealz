import { Service } from '@andcreations/common';
import {
  calculateFact,
  calculateAmount,
} from '@mealz/backend-ingredients-shared';

import { I18nService } from '../../i18n';
import { IngredientFacts } from '../../ingredients/types';
import {
  getCaloriesPer100,
  getCarbsPer100,
  getProteinPer100,
  getFatPer100,
  getFacts,
} from '../../ingredients/utils';
import { INVALID_AMOUNT } from '../const';
import {
  CalculateAmountsResult,
  CollapseToOneIngredientResult,
  Macros,
  MealPlannerIngredient,
  MealSummaryResult,
} from '../types';
import { MealCalculatorTranslations } from './MealCalculator.translations';
import { truncateNumber } from '@mealz/backend-shared';

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

  public getCaloriesForAmount(
    ingredient: MealPlannerIngredient,
    amount: number,
  ): number | undefined {
    const caloriesPer100 = this.getCaloriesPer100(ingredient);
    return calculateFact(amount, caloriesPer100);
  }

  public getCarbsPer100(
    ingredient: MealPlannerIngredient,
  ): number | undefined {
    if (ingredient.fullIngredient) {
      return getCarbsPer100(ingredient.fullIngredient);
    }
    if (ingredient.adHocIngredient) {
      return ingredient.adHocIngredient.carbsPer100;
    }
    return undefined;
  }

  public getProteinPer100(
    ingredient: MealPlannerIngredient,
  ): number | undefined {
    if (ingredient.fullIngredient) {
      return getProteinPer100(ingredient.fullIngredient);
    }
    if (ingredient.adHocIngredient) {
      return ingredient.adHocIngredient.proteinPer100;
    }
    return undefined;
  }

  public getFatPer100(
    ingredient: MealPlannerIngredient,
  ): number | undefined {
    if (ingredient.fullIngredient) {
      return getFatPer100(ingredient.fullIngredient);
    }
    if (ingredient.adHocIngredient) {
      return ingredient.adHocIngredient.fatPer100;
    }
    return undefined;
  }

  public getMacrosPer100(
    ingredient: MealPlannerIngredient,
  ): Partial<Macros> {
    return {
      carbs: this.getCarbsPer100(ingredient),
      protein: this.getProteinPer100(ingredient),
      fat: this.getFatPer100(ingredient),
    };
  }

  public getMacrosForAmount(
    ingredient: MealPlannerIngredient,
    amount: number,
  ): Partial<Macros> {
    const macrosPer100 = this.getMacrosPer100(ingredient);
    const calculate = (amount: number, factPer100?: number) => {
      if (factPer100 === undefined) {
        return undefined;
      }
      return calculateFact(amount, factPer100);
    };
    return {
      carbs: calculate(amount, macrosPer100.carbs),
      protein: calculate(amount, macrosPer100.protein),
      fat: calculate(amount, macrosPer100.fat),
    };
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
      if (!!ingredient.fullIngredient) {
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

  public collapseToOneIngredient(
    calories: number | undefined,
    ingredients: MealPlannerIngredient[],
    collapsedIngredientName: string,
  ): CollapseToOneIngredientResult {
    const result = this.calculateAmounts(
      calories,
      ingredients,
    );
    if (result.error) {
      return {
        ingredients,
        collapsed: false,
      };
    }

    let totalAmount = 0;
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;

    for (const ingredient of result.ingredients) {
      const amount = ingredient.calculatedAmount ?? 0;
      totalAmount += amount;

      const caloriesPer100 = this.getCaloriesPer100(ingredient);
      const carbsPer100 = this.getCarbsPer100(ingredient);
      const proteinPer100 = this.getProteinPer100(ingredient);
      const fatPer100 = this.getFatPer100(ingredient);

      totalCalories += calculateFact(amount, caloriesPer100 ?? 0);
      totalCarbs += calculateFact(amount, carbsPer100 ?? 0);
      totalProtein += calculateFact(amount, proteinPer100 ?? 0);
      totalFat += calculateFact(amount, fatPer100 ?? 0);
    }

    if (totalAmount === 0) {
      return {
        ingredients,
        collapsed: false,
      };
    }
    totalAmount = truncateNumber(totalAmount);

    const collapsedIngredient: MealPlannerIngredient = {
      adHocIngredient: {
        name: collapsedIngredientName,
        caloriesPer100: truncateNumber((totalCalories * 100) / totalAmount),
        carbsPer100: truncateNumber((totalCarbs * 100) / totalAmount),
        proteinPer100: truncateNumber((totalProtein * 100) / totalAmount),
        fatPer100: truncateNumber((totalFat * 100) / totalAmount),
      },
      enteredAmount: `${totalAmount}`,
      calculatedAmount: totalAmount,
    };

    return {
      ingredients: [collapsedIngredient],
      collapsed: true,
    };
  }  
}