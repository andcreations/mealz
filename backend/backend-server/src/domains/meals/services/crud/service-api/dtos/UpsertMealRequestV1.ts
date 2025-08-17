import { UpsertObject } from '@mealz/backend-db';
import { Meal } from '@mealz/backend-meals-common';

export class UpsertMealRequestV1 {
  public meal: UpsertObject<Meal, 'id'>;
}