import { GWMealDailyPlanGoals } from './GWMealDailyPlanGoals';

export interface GWMealDailyPlanEntry {
  // Start hour of the meal
  startHour: number;

  // Start minute of the meal
  startMinute: number;

  // End hour of the meal
  endHour: number;

  // End minute of the meal
  endMinute: number;

  // Name of the meal
  mealName: string;

  // Goals for the meal
  goals: GWMealDailyPlanGoals;
}