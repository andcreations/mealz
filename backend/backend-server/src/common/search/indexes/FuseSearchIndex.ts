import * as fuse from 'fuse.js';

import {
  SearchDocument,
  SearchIndexOptions,
  SearchIndex,
  SearchOptions,
  SearchResult,
} from '../types';

export class FuseSearchIndex<T extends SearchDocument> extends SearchIndex<T> {
  private readonly index: Fuse<T>;

  public constructor(options: SearchIndexOptions<T>) {
    super(options);
    this.index = this.createIndex();
  }

  private createIndex(): Fuse<T> {
    const FuseCtr = fuse as any as Fuse<T>;
    const fuseOptions: fuse.IFuseOptions<T> = {
      includeScore: true,
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.6,
      keys: this.getOptions().fields.map(field => field.name) as string[],
    };
    return new FuseCtr([], fuseOptions);
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
      {
        limit: options.limit,
      }
    );
    return {
      ids: (items ?? []).map(item => item.item.id),
    };
  }
}

interface Fuse<T> {
  new (documents: T[], options: fuse.IFuseOptions<T>): Fuse<T>;
  search<R = T>(
    pattern: string,
    options?: fuse.FuseSearchOptions,
  ): fuse.FuseResult<R>[];
  add(document: T): void;
}