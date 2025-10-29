import { MealIngredientV1 } from './MealIngredientV1';

export class MealDetailsV1 {
  // Calories entered by the user
  calories?: number;

  // Ingredients entered by the user
  ingredients: MealIngredientV1[];
}