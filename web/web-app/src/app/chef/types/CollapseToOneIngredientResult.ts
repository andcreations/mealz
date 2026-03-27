import { MealPlannerIngredient } from './MealPlannerIngredient';

export interface CollapseToOneIngredientResult {
  ingredients: MealPlannerIngredient[];
  collapsed: boolean;
}