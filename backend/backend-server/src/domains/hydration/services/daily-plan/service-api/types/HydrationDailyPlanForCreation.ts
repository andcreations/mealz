import { HydrationDailyPlan } from './HydrationDailyPlan';

export type HydrationDailyPlanForCreation = Omit<HydrationDailyPlan,
  | 'id'
  | 'createdAt'
>;