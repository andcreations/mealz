import { MealDailyPlan } from './MealDailyPlan';

export type MealDailyPlanForCreation = Omit<MealDailyPlan, 'id' | 'createdAt'>;