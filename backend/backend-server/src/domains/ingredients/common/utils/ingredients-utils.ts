import { FactId, FactPer100, Ingredient } from '../types';

export function getFact(
  ingredient: Ingredient,
  factId: FactId,
): FactPer100 | undefined {
  return ingredient.factsPer100.find(fact => fact.id === factId);
}

export function getFactAmount(
  ingredient: Ingredient,
  factId: FactId,
): number | undefined {
  return getFact(ingredient, factId)?.amount;
}

export function getCaloriesPer100(
  ingredient: Ingredient,
): number | undefined {
  return getFact(ingredient, FactId.Calories)?.amount;
}