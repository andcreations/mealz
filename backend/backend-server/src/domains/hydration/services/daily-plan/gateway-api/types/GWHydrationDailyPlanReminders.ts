import {
  GWHydrationDailyPlanReminderEntry,
} from './GWHydrationDailyPlanReminderEntry';

export interface GWHydrationDailyPlanReminders {
  // Whether reminders are enabled
  enabled: boolean;

  // Reminder entries
  entries: GWHydrationDailyPlanReminderEntry[];
}