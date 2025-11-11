import { MealDailyPlanGoalsV1 } from './MealDailyPlanGoalsV1';

export class MealDailyPlanEntryDetailsV1 {
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
  public goals: MealDailyPlanGoalsV1;
}