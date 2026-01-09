import {
  HydrationDailyPlanReminderEntryDetailsV1,
} from './HydrationDailyPlanReminderEntryDetailsV1';

export class HydrationDailyPlanRemindersDetailsV1 {
  // Whether reminders are enabled
  public enabled: boolean;

  // Reminder entries
  public entries: HydrationDailyPlanReminderEntryDetailsV1[];
}