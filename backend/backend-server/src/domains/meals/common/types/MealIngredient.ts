import { AdHocIngredient } from './AdHocIngredient';

export class MealIngredient {
  // Identifier of a full ingredient
  ingredientId?: string;

  // Ad-hoc ingredient entered by the user
  adHocIngredient?: AdHocIngredient;

  // Amount entered by the user
  enteredAmount?: string;
}