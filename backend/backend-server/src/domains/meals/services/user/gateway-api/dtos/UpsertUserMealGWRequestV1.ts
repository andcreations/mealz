import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';

export interface UpsertUserMealGWRequestV1 {
  // User meal identifier
  id?: string;

  // User meal type
  typeId: string;

  // Meal
  meal: GWMealWithoutId;
}