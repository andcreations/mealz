import { AdHocIngredient } from '../types';

export function parseAdHocIngredient(
  str: string,
): AdHocIngredient | undefined {
  const match = str.match(/^([a-zA-Z_][a-zA-Z0-9_ ]*) (\d+(?:\.\d+)?)$/);
  if (!match) {
    return undefined;
  }
  const [_, name, caloriesStr] = match;

  const calories = parseFloat(caloriesStr);
  if (isNaN(calories)) {
    return undefined;
  }

  return {
    name: name.trim(),
    caloriesPer100: calories,
  };
}

export function toAdHocIngredientStr(
  ingredient: AdHocIngredient,
  fractionDigits = 0,
): string {
  return `${ingredient.name} ${ingredient.caloriesPer100.toFixed(fractionDigits)}`;
}