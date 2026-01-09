import { GWHydrationDailyPlan } from './GWHydrationDailyPlan';

export type GWHydrationDailyPlanForUpdate = Omit<GWHydrationDailyPlan, 
  | 'id'
  | 'createdAt'
>;