export interface IterateCallback<T> {
  /**
   * Callback function to be called when a new entity is found.
   * @param entity - The entity found.
   */
  onNext(entity: T): Promise<void>;

  /**
   * Callback function to be called when the iteration is complete.
   */
  onComplete(): Promise<void>;
}