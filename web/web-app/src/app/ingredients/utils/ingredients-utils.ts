import {
  GWFactId,
  GWFactPer100,
  GWIngredient,
} from '@mealz/backend-ingredients-gateway-api';
import { IngredientFacts } from '../types';

export function getFact(
  ingredient: GWIngredient,
  factId: GWFactId,
): GWFactPer100 | undefined {
  return ingredient.factsPer100.find(fact => fact.id === factId);
}

export function getCaloriesPer100(
  ingredient: GWIngredient,
): number | undefined {
  return getFact(ingredient, GWFactId.Calories)?.amount;
}

export function getCarbsPer100(
  ingredient: GWIngredient,
): number | undefined {
  return getFact(ingredient, GWFactId.Carbs)?.amount;
}

export function getProteinPer100(
  ingredient: GWIngredient,
): number | undefined {
  return getFact(ingredient, GWFactId.Protein)?.amount;
}

export function getFatPer100(
  ingredient: GWIngredient,
): number | undefined {
  return getFact(ingredient, GWFactId.TotalFat)?.amount;
}

export function getFacts(ingredient: GWIngredient): IngredientFacts {
  const amount = (factId: GWFactId) => {
    return getFact(ingredient, factId)?.amount;
  };
  return {
    calories: amount(GWFactId.Calories),
    carbs: amount(GWFactId.Carbs),
    sugars: amount(GWFactId.Sugars),
    protein: amount(GWFactId.Protein),
    totalFat: amount(GWFactId.TotalFat),
    saturatedFat: amount(GWFactId.SaturatedFat),
    monounsaturatedFat: amount(GWFactId.MonounsaturatedFat),
    polyunsaturatedFat: amount(GWFactId.PolyunsaturatedFat),
  };
}
