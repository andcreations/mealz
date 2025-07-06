import { GWIngredient } from '#mealz/backend-ingredients-gateway-api';

export interface ReadManyIngredientsGWResponseV1 {
  ingredients: GWIngredient[];
}