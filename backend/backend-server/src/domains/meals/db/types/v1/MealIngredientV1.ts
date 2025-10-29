import { AdHocIngredientV1 } from './AdHocIngredientV1';

export class MealIngredientV1 {
  // Identifier of a full ingredient
  ingredientId?: string;

  // Ad-hoc ingredient entered by the user
  adHocIngredient?: AdHocIngredientV1;

  // Amount entered by the user
  enteredAmount?: string;
}