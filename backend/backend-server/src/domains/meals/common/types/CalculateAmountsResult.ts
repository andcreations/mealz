import { Ingredient } from '@mealz/backend-ingredients-common';
import { MealWithoutId } from './MealWithoutId';

export interface CalculateAmountsResult {
  // Meal with calculated amounts
  meal: MealWithoutId;

  // Meal ingredients
  ingredients: Ingredient[];
}
