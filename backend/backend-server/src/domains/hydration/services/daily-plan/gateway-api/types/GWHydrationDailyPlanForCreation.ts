import { GWHydrationDailyPlan } from './GWHydrationDailyPlan';

export type GWHydrationDailyPlanForCreation = Omit<GWHydrationDailyPlan, 
  | 'id'
  | 'createdAt'
>;