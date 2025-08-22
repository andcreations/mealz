import { GWMeal } from '@mealz/backend-meals-gateway-api';

export interface GWUserMeal {
  // User meal identifier
  id: string;

  // User identifier
  userId: string;

  // Meal
  meal: GWMeal;

  // User meal type
  type: string;
}