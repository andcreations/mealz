import { GWMeal } from '@mealz/backend-meals-gateway-api';

export interface LogMealGWRequestV1 {
  // Meal
  meal: Omit<GWMeal, 'id'>;
}