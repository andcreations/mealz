import { GWMeal } from '@mealz/backend-meals-gateway-api';

export interface UpsertUserMealGWRequestV1 {
  // User meal identifier
  id?: string;

  // User meal type
  type: string;

  // Meal
  meal: Omit<GWMeal, 'id'>;
}