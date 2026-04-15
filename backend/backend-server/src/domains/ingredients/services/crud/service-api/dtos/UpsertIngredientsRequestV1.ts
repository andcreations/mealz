import { UpsertObject } from '@mealz/backend-db';
import { Ingredient } from '@mealz/backend-ingredients-common';

export interface UpsertIngredientsRequestV1 {
  ingredients: UpsertObject<Ingredient, 'id'>[];
}