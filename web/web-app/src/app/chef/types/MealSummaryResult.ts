import { IngredientFacts } from '../../ingredients';

export interface MealSummaryTotals extends IngredientFacts {
  grams: number;
}

export interface MealSummaryResult {
  total: MealSummaryTotals;
  hasFullIngredients: boolean;
  hasAdHocIngredients: boolean;
}