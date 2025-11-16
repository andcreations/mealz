import { GWMeal } from '@mealz/backend-meals-gateway-api';

export interface GWUserMeal<T = any> {
  // User meal identifier
  id: string;

  // User identifier
  userId: string;

  // Meal
  meal: GWMeal;

  // User meal type identifier
  typeId: string;

  // Metadata
  metadata?: T;
}