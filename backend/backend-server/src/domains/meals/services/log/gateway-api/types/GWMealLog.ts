import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';

export interface GWMealLog {
  // Meal log identifier
  id: string;

  // User identifier
  userId: string;

  // Meal identifier
  mealId: string;

  // Daily plan meal name
  dailyPlanMealName?: string;

  // Timestamp (UTC) when the meal was logged
  loggedAt: number;

  // Meal
  meal: GWMealWithoutId;
}