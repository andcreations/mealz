export interface GWHydrationDailyPlanReminderEntry {
  // Start hour of the reminder
  startHour: number;

  // Start minute of the reminder
  startMinute: number;

  // End hour of the reminder
  endHour: number;

  // End minute of the reminder
  endMinute: number;

  // Number of minutes since last water intake that triggers the reminder
  minutesSinceLastWaterIntake: number;

  // Period in minutes between reminders
  periodInMinutes: number;
}