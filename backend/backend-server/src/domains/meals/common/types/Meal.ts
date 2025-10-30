import { MealIngredient } from './MealIngredient';

export class Meal {
  // Meal identifier
  public id: string;

  // Meal calories
  public calories?: number;

  // Meal ingredients
  public ingredients: MealIngredient[];
}
