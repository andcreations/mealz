import { HydrationDailyPlanGoals } from './HydrationDailyPlanGoals';
import { HydrationDailyPlanReminders } from './HydrationDailyPlanReminders';

export class HydrationDailyPlan {
  // Hydration daily plan identifier
  public id: string;

  // User identifier
  public userId: string;

  // Goals for the daily plan
  public goals: HydrationDailyPlanGoals;

  // Reminders for the daily plan
  public reminders: HydrationDailyPlanReminders;

  // Timestamp (UTC) when the daily plan was created
  public createdAt: number;
}