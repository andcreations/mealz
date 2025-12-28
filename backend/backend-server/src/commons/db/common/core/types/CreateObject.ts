// Type for an object to be created.
// Omits the primary key.
export type CreateObject<T, K extends keyof T> = Omit<T, K>