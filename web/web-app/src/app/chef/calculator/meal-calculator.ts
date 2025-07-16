import { MealPlannerIngredient } from '../types';

export function calculateAmounts(
  ingredients: MealPlannerIngredient[],
): MealPlannerIngredient[] {
  const result: MealPlannerIngredient[] = ingredients.map(ingredient => {
    return Object.assign({}, ingredient);
  });

  // TODO Calculate the amounts.
  result.forEach(ingredient => {
    ingredient.calculatedAmount = parseFloat(ingredient.enteredAmount);
  });

  return result;
}