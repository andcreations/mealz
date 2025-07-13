import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

export interface MealPlannerIngredient {
  // Ingredient, optional as the user might have yet picked the ingredient
  ingredient?: GWIngredient;

  // Amount entered by the user
  enteredAmount?: string;

  // Calculated amount of the ingredient
  calculatedAmount?: number;
}