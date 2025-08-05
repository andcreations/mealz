import { Meal } from '@mealz/backend-meals-common';

export class CreateMealRequestV1 {
  public meal: Omit<Meal, 'id'>;
}