import { GWAdHocIngredient } from './GWAdHocIngredient';

export interface GWMealIngredient {
  // Identifier of a full ingredient
  ingredientId?: string;

  // Ad-hoc ingredient entered by the user
  adHocIngredient?: GWAdHocIngredient;

  // Amount entered by the user
  enteredAmount?: string;  
}