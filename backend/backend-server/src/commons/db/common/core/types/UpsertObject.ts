// Type for an object to be upserted. Makes (primary) keys optional.
export type UpsertObject<T, K extends keyof T, O extends keyof T = never> = 
  Omit<T, K | O> &
  Partial<Pick<T, K>>;
