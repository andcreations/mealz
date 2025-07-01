import { SearchDocument } from './SearchDocument';
import { SearchIndexOptions } from './SearchIndexOptions';
import { SearchOptions } from './SearchOptions';
import { SearchResult } from './SearchResult';

export abstract class SearchIndex<T extends SearchDocument> {
  public constructor(private readonly options: SearchIndexOptions<T>) {
  }

  protected getOptions(): SearchIndexOptions<T> {
    return this.options;
  }

  /**
   * Adds a document to the index.
   * @param document Document to add.
   */
  public abstract addDocument(document: T): Promise<void>;

  /**
   * Searches the index.
   * @param pattern Pattern to search
   * @param options Search options.
   */
  public abstract search(
    pattern: string,
    options: SearchOptions,
  ): Promise<SearchResult>;
}