export interface Span {
  setAttribute(key: string, value: string): void;
  ok(): void;
  error(error: any): void;
  end(): void;
}