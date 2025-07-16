import {
  GWFactId,
  GWFactPer100,
  GWIngredient,
} from '@mealz/backend-ingredients-gateway-api';

export function getFact(
  ingredient: GWIngredient,
  factId: GWFactId,
): GWFactPer100 | undefined {
  return ingredient.factsPer100.find(fact => fact.id === factId);
}

export function getCaloriesPer100(
  ingredient: GWIngredient,
): number | undefined{
  return getFact(ingredient, GWFactId.Calories)?.amount;
}

export function getFacts(ingredient: GWIngredient): {
  calories: number | undefined;
  carbs: number | undefined;
  sugars: number | undefined;
  protein: number | undefined;
  totalFat: number | undefined;
  saturatedFat: number | undefined;
  monounsaturatedFat: number | undefined;
  polyunsaturatedFat: number | undefined;
} {
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

export function calculateFact(
  amount: number,
  factPer100: number,
): number {
  return (amount / 100) * factPer100;
}
