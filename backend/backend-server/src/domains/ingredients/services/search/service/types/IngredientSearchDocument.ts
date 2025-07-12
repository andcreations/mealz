import { SearchDocument } from '@mealz/backend-common';

export interface IngredientSearchDocument extends SearchDocument{
  id: string;
  name: string;
}