import { Injectable } from '@nestjs/common';
import {
  InternalError,
  SearchIndex,
  MiniSearchIndex,
  FuseSearchIndex,
} from '#mealz/backend-common';

import { SEARCH_INDEX_OPTIONS } from '../const';
import { IngredientSearchDocument } from '../types';

export enum SearchIndexStrategy {
  MiniSearch = 'mini-search',
  FuseSearch = 'fuse-search',
}

@Injectable()
export class SearchIndexFactory {
  public create(
    strategy: SearchIndexStrategy,
  ): SearchIndex<IngredientSearchDocument> {
    switch (strategy) {
      case SearchIndexStrategy.MiniSearch:
        return new MiniSearchIndex(SEARCH_INDEX_OPTIONS);
      case SearchIndexStrategy.FuseSearch:
        return new FuseSearchIndex(SEARCH_INDEX_OPTIONS);
      default:
      throw new InternalError(`Unknown search index straregy`);
    }
  }
}