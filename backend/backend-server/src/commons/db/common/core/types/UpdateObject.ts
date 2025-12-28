// Type for an object to be updated.
// Makes all fields, but the primary key, optional.
export type UpdateObject<T, K extends keyof T> = 
  Pick<T, K> &
  Partial<Omit<T, K>>;
