import { HydrationDailyPlan } from './HydrationDailyPlan';

export type HydrationDailyPlanForUpdate = Omit<HydrationDailyPlan, 'createdAt'>;