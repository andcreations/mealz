import { truncateNumber } from '@mealz/backend-shared';
import { Goal, Macros } from '@mealz/backend-calculators';

import { MealEntry, MealGoals } from '../types';
import { marginForAmount } from '../consts';

export class MealEntryCalculator {
  public static calculateMacrosByGoal(
    mealEntry: MealEntry,
    goal: Goal,
  ): Pick<MealGoals, 'carbs' | 'protein' | 'fat'> {
    const macros = Macros.calculateForCalories(mealEntry.goals.calories, goal);
    return {
      carbs: truncateNumber(macros.carbsInGrams),
      protein: truncateNumber(macros.proteinInGrams),
      fat: truncateNumber(macros.fatInGrams),
    };
  }
  public static calculateMargins(
    goals: Pick<MealGoals, 'calories' | 'carbs' | 'protein' | 'fat'>,
  ): Pick<MealGoals,
      | 'caloriesMargin'
      | 'carbsMargin'
      | 'proteinMargin'
      | 'fatMargin'
    > {
    return {
      caloriesMargin: marginForAmount(goals.calories),
      carbsMargin: marginForAmount(goals.carbs),
      proteinMargin: marginForAmount(goals.protein),
      fatMargin: marginForAmount(goals.fat),
    };
  }
}