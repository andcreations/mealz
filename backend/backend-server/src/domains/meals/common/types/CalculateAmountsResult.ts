import { Ingredient } from '@mealz/backend-ingredients-common';

import { MealWithoutId } from './MealWithoutId';
import { MealTotals } from './MealTotals';

export interface CalculateAmountsResult {
  // Meal with calculated amounts
  meal: MealWithoutId;

  // Meal ingredients
  ingredients: Ingredient[];

  // Meal totals
  totals: MealTotals;
}
