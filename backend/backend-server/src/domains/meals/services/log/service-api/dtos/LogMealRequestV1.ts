import { MealWithoutId } from '@mealz/backend-meals-common';
import { MealLog } from '../types';

export class LogMealRequestV1 {
  // User identifier
  public userId: MealLog['userId'];

  // Meal
  public meal: MealWithoutId;

  // Daily plan meal name
  public dailyPlanMealName?: MealLog['dailyPlanMealName'];
}