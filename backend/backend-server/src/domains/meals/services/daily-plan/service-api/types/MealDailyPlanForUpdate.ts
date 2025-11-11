import { MealDailyPlan } from './MealDailyPlan';

export type MealDailyPlanForUpdate = Omit<MealDailyPlan, 'createdAt'>;