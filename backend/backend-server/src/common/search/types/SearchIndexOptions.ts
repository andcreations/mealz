import { SearchDocument } from './SearchDocument';

export enum SearchFieldType {
  String = 'string',
}

export interface SearchField<T extends SearchDocument> {
  name: keyof T;
  type: SearchFieldType;
}

export interface SearchIndexOptions<T extends SearchDocument> {
  fields: SearchField<T>[];
}