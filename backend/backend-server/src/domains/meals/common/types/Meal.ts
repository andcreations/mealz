import { MealIngredient } from './MealIngredient';

export class Meal {
  // Meal identifier
  id: string;

  // Meal calories
  calories?: number;

  // Meal ingredients
  ingredients: MealIngredient[];
}