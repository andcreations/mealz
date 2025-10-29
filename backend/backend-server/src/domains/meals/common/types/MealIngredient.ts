import { AdHocIngredient } from './AdHocIngredient';

export class MealIngredient {
  // Identifier of a full ingredient
  public ingredientId?: string;

  // Ad-hoc ingredient entered by the user
  public adHocIngredient?: AdHocIngredient;

  // Amount entered by the user
  public enteredAmount?: string;
}