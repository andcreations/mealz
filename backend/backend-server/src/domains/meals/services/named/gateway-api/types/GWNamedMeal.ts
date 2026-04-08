import { GWNamedMealSharedBy } from './GWNamedMealSharedBy';

export interface GWNamedMeal {
  // Named meal identifier
  id: string;

  // Name of the named meal
  name: string;

  // Meal identifier
  mealId: string;

  // Shared by user
  sharedBy?: GWNamedMealSharedBy;
}