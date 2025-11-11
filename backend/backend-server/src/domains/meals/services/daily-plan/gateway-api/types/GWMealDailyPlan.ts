import { GWMealDailyPlanEntry } from './GWMealDailyPlanEntry';

export interface GWMealDailyPlan {
  // Meal daily plan identifier
  id: string;

  // Entries in the daily plan
  entries: GWMealDailyPlanEntry[];

  // Timestamp (UTC) when the daily plan was created
  createdAt: number;
}