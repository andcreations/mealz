export interface SagaOperation {
  // Gets the operation identifier. It should be human-readable.
  getId(): string;

  // Performs the operation
  do: () => Promise<void>;

  // Performs the reverse operations. Does nothing if undefined.
  undo?: () => Promise<void>;
}

export interface Saga {
  id: string;
  operations: SagaOperation[];
}