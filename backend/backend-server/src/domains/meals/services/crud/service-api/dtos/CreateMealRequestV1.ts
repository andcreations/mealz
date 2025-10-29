import { Meal } from '@mealz/backend-meals-common';

export class CreateMealRequestV1 {
  // Meal to create
  public meal: Omit<Meal, 'id'>;
}