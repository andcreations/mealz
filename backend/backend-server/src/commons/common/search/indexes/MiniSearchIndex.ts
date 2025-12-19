import * as minisearch from 'minisearch';

import {
  SearchDocument,
  SearchIndexOptions,
  SearchIndex,
  SearchOptions,
  SearchResult,
} from '../types';

export class MiniSearchIndex<T extends SearchDocument> extends SearchIndex<T> {
  private readonly index: MiniSearch<T>;

  public constructor(options: SearchIndexOptions<T>) {
    super(options);
    this.index = this.createIndex();
  }

  private createIndex(): MiniSearch<T> {
    const MiniSearchCtr = minisearch as any as MiniSearch<T>;
    const minisearchOptions: minisearch.Options = {
      fields: this.getOptions().fields.map(field => field.name) as string[],
      idField: 'id',
      searchOptions: {
        fuzzy: 0.4,
      },
    };
    return new MiniSearchCtr(minisearchOptions);
  }

  public async addDocument(document: T): Promise<void> {
    this.index.add(document);
  }

  public async search(
    pattern: string,
    options: SearchOptions,
  ): Promise<SearchResult> {
    const items = this.index.search(
      pattern,
      {},
    );
    return {
      ids: (items ?? [])
        .slice(0, options.limit)
        .map(item => item.id),
    };
  }
}

interface MiniSearch<T> {
  new (options: minisearch.Options): MiniSearch<T>;
  add(document: T): void;
  search(
    query: minisearch.Query,
    options?: minisearch.SearchOptions,
  ): minisearch.SearchResult[];
}