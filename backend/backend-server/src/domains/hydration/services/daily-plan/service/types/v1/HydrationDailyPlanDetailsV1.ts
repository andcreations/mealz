import {
  HydrationDailyPlanGoalsDetailsV1,
} from './HydrationDailyPlanGoalsDetailsV1';
import {
  HydrationDailyPlanRemindersDetailsV1,
} from './HydrationDailyPlanRemindersDetailsV1';

export class HydrationDailyPlanDetailsV1 {
  // Goals for the daily plan
  public goals: HydrationDailyPlanGoalsDetailsV1;

  // Reminders for the daily plan
  public reminders: HydrationDailyPlanRemindersDetailsV1;
}