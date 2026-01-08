import { GWHydrationDailyPlanGoals } from './GWHydrationDailyPlanGoals';
import { GWHydrationDailyPlanReminders } from './GWHydrationDailyPlanReminders';

export interface GWHydrationDailyPlan {
  // Hydration daily plan identifier
  id: string;

  // Goals for the daily plan
  goals: GWHydrationDailyPlanGoals;

  // Reminders for the daily plan
  reminders: GWHydrationDailyPlanReminders;

  // Timestamp (UTC) when the daily plan was created
  createdAt: number;
}