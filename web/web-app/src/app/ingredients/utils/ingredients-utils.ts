import {
  GWFactId,
  GWFactPer100,
  GWIngredient,
} from '@mealz/backend-ingredients-gateway-api';

export function getIngredientFact(
  ingredient: GWIngredient,
  factId: GWFactId,
): GWFactPer100 | undefined {
  return ingredient.factsPer100.find(fact => fact.id === factId);
}
