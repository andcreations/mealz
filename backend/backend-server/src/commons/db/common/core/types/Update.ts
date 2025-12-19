export type UpdateOperator<T> = {
  $set?: T[keyof T];
  $inc?: number;
};

export type Update<T> = {
  [key: string]: UpdateOperator<T>;
};
