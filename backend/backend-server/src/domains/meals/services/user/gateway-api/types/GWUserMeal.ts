import { GWMeal } from '@mealz/backend-meals-gateway-api';

export interface GWUserMeal {
  // User meal identifier
  id: string;

  // Meal
  meal: GWMeal;
}