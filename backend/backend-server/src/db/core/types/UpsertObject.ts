// Type for an object to be upserted. Makes (primary) keys optional.
export type UpsertObject<T, K extends keyof T> = 
  Omit<T, K> &
  Partial<Pick<T, K>>;
