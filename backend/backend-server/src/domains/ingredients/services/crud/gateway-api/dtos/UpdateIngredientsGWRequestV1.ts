import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

export type UpsertIngredientsGWRequestV1Ingredient =
  Partial<Pick<GWIngredient, 'id'>> & Omit<GWIngredient, 'id'>;

export interface UpsertIngredientsGWRequestV1 {
  ingredients: UpsertIngredientsGWRequestV1Ingredient[];
}