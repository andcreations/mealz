export class HydrationDailyPlanReminderEntry {
  // Start hour of the reminder
  public startHour: number;

  // Start minute of the reminder
  public startMinute: number;

  // End hour of the reminder
  public endHour: number;

  // End minute of the reminder
  public endMinute: number;

  // Number of minutes since last water intake that triggers the reminder
  public minutesSinceLastWaterIntake: number;

  // Period in minutes between reminders
  public periodInMinutes: number;
}