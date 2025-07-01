import { SearchFieldType, SearchIndexOptions } from '#mealz/backend-common';
import { IngredientSearchDocument } from '../types';

export const SEARCH_INDEX_OPTIONS: SearchIndexOptions<
  IngredientSearchDocument
> = {
  fields: [
    {
      name: 'id',
      type: SearchFieldType.String,
    },
    {
      name: 'name',
      type: SearchFieldType.String,
    },
  ]
};