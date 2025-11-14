import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';

export interface LogMealGWRequestV1 {
  // Meal
  meal: GWMealWithoutId;

  // Daily plan meal name
  dailyPlanMealName?: string;
}