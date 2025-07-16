import * as minisearch from 'minisearch';

export interface SearchDocument {
  id: string;
  [key: string]: string;
}

export interface SearchIndexOptions<T extends SearchDocument> {
  fields: (keyof T)[];
}

export interface SearchOptions {
  limit: number;
}

export interface SearchResult {
  ids: string[];
}

export class SearchIndex<T extends SearchDocument> {
  private readonly index: MiniSearch<T>;

  public constructor(options: SearchIndexOptions<T>) {
    this.index = this.createIndex(options);
  }

  private createIndex(options: SearchIndexOptions<T>): MiniSearch<T> {
    const MiniSearchCtr = minisearch as any as MiniSearch<T>;
    const minisearchOptions: minisearch.Options = {
      fields: options.fields as string[],
      idField: 'id',
      searchOptions: {
        prefix: true,
        fuzzy: 0.4,
      },
    };
    return new MiniSearchCtr(minisearchOptions);    
  }

  public async addDocument(document: T): Promise<void> {
    this.index.add(document);
  }  

  public search(
    pattern: string,
    options: SearchOptions,
  ): SearchResult {
    const items = this.index.search(pattern);
    return {
      ids: (items ?? [])
        .slice(0, options.limit)
        .map(item => item.id),
    };
  }  
}

// necessary to avoid type errors
interface MiniSearch<T> {
  new (options: minisearch.Options): MiniSearch<T>;
  add(document: T): void;
  search(
    query: minisearch.Query,
    options?: minisearch.SearchOptions,
  ): minisearch.SearchResult[];
}