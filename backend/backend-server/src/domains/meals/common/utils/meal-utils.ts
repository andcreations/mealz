import { MealWithoutId } from '../types';

export function removeEmptyIngredients(meal: MealWithoutId): MealWithoutId {
  return {
    ...meal,
    ingredients: meal.ingredients.filter(ingredient => {
      return (
        ingredient.ingredientId != null ||
        ingredient.adHocIngredient != null
      );
    })
  };
}