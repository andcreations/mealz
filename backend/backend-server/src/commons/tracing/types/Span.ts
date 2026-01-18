import { AttributeValue } from '@opentelemetry/api';

export interface Span {
  setAttribute(key: string, value: AttributeValue): void;
  ok(): void;
  error(error: any): void;
  end(): void;
}