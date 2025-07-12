import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

export interface ReadIngredientsFromLastGWResponseV1 {
  ingredients: GWIngredient[];
}