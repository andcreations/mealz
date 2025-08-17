export interface SagaOperation<TContext> {
  // Gets the operation identifier. It should be human-readable.
  getId: () => string;

  // Performs the operation
  do: (context: TContext) => Promise<void>;

  // Performs the reverse operations. Does nothing if undefined.
  undo?: (context: TContext) => Promise<void>;
}

export interface Saga<TContext> {
  id: string;
  operations: SagaOperation<TContext>[];
}