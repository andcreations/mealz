import { Meal } from '@mealz/backend-meals-common';
import { UserMeal } from '../types';

export class CreateUserMealRequestV1 {
  // User identifier
  public userId: UserMeal['userId'];

  // User meal type
  public typeId: UserMeal['typeId'];

  // Meal
  public meal: Omit<Meal, 'id'>;
}