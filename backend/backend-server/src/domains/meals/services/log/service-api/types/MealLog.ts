export class MealLog {
  // Meal log identifier
  public id: string;

  // User identifier
  public userId: string;

  // Meal identifier
  public mealId: string; 
  
  // Daily plan meal name
  public dailyPlanMealName?: string;

  // Timestamp (UTC) when the meal was logged
  public loggedAt: number;
}