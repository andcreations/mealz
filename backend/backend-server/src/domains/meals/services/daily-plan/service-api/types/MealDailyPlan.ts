import { MealDailyPlanEntry } from './MealDailyPlanEntry';

export class MealDailyPlan {
  // Meal daily plan identifier
  public id: string;

  // User identifier
  public userId: string;

  // Entries in the daily plan
  public entries: MealDailyPlanEntry[];

  // Timestamp (UTC) when the daily plan was created
  public createdAt: number;
}