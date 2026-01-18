import { 
  AttributeValue,
  Span as OTLSpan,
  SpanStatusCode,
} from '@opentelemetry/api';
import { Span } from './Span';

export class SpanImpl implements Span {
  private readonly span: OTLSpan;

  public constructor(span: OTLSpan) {
    this.span = span;
  }

  public setAttribute(key: string, value: AttributeValue): void {
    this.span.setAttribute(key, value);
  }
  public ok(): void {
    this.span.setStatus({ code: SpanStatusCode.OK });
  }
  public error(error: any): void {
    this.span.recordException(error);
    this.span.setStatus({ code: SpanStatusCode.ERROR });
  }
  public end(): void {
    this.span.end();
  }
}