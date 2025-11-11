import { GWMealDailyPlan } from './GWMealDailyPlan';

export type GWMealDailyPlanForUpdate = Omit<GWMealDailyPlan, 
  | 'id'
  | 'createdAt'
>;