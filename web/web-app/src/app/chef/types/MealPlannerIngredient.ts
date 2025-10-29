import { AdHocIngredient } from '@mealz/backend-ingredients-shared';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

export interface MealPlannerIngredient {
  // Ingredient, optional as the user might not have yet picked the ingredient
  fullIngredient?: GWIngredient;

  // Ad-hoc ingredient entered by the user
  adHocIngredient?: AdHocIngredient;

  // Amount entered by the user
  enteredAmount?: string;

  // Calculated amount of the ingredient
  calculatedAmount?: number;
}