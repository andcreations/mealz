import {
  HydrationDailyPlanReminderEntry,
} from './HydrationDailyPlanReminderEntry';

export class HydrationDailyPlanReminders {
  // Whether reminders are enabled
  public enabled: boolean;

  // Reminder entries
  public entries: HydrationDailyPlanReminderEntry[];
}