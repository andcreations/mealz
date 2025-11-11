import { MealDailyPlanGoals } from './MealDailyPlanGoals';

export class MealDailyPlanEntry {
  // Start hour of the meal
  public startHour: number;

  // Start minute of the meal
  public startMinute: number;

  // End hour of the meal
  public endHour: number;

  // End minute of the meal
  public endMinute: number;

  // Name of the meal
  public mealName: string;

  // Goals for the meal
  public goals: MealDailyPlanGoals;
}