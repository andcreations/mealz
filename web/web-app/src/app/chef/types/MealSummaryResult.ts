import { IngredientFacts } from '../../ingredients';

export interface MealSummaryResult {
  total: IngredientFacts;
  hasFullIngredients: boolean;
  hasAdHocIngredients: boolean;
}