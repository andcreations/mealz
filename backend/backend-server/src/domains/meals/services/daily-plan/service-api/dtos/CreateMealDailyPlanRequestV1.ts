import { MealDailyPlanForCreation } from '../types';

export interface CreateMealDailyPlanRequestV1 {
  // Daily plan
  mealDailyPlan: MealDailyPlanForCreation;
}