import { GWMealDailyPlan } from './GWMealDailyPlan';

export type GWMealDailyPlanForCreation = Omit<GWMealDailyPlan, 
  | 'id'
  | 'createdAt'
>;