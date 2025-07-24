import { MealPlannerIngredient } from './MealPlannerIngredient';

export interface CalculateAmountsResult {
  error: string | null;
  ingredients: MealPlannerIngredient[];
}