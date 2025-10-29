import { GWMealIngredient } from './GWMealIngredient';

export interface GWMeal {
  // Meal identifier
  id: string;

  // Meal calories
  calories?: number;

  // Meal ingredients
  ingredients: GWMealIngredient[];
}