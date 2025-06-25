import { Projection } from './Projection';

export type SortOrder = 'asc' | 'desc';

export type Sort<T> = {
  [field in keyof T]?: SortOrder;
}

export interface FindOptions<T, K extends keyof T> {
  projection?: Projection<T>;
  limit?: number;
  offset?: number;
  sort?: Sort<T>[];
}