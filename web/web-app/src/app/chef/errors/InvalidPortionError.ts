export class InvalidPortionError extends Error {
  constructor(portion: string) {
    super(`Invalid portion: ${portion}`);
  }
}