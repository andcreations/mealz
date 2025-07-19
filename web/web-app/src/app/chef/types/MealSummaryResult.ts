import { IngredientFacts } from '../../ingredients';

export interface MealSummaryResult {
  total:
    Pick<IngredientFacts, 'calories'> &
    Partial<Omit<IngredientFacts, 'calories'>>;
}