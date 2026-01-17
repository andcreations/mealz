import { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { ExportResult, ExportResultCode } from '@opentelemetry/core';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';

const SPAN_NAME: Record<SpanKind, string> = {
  [SpanKind.INTERNAL]: 'INTERNAL',
  [SpanKind.SERVER]: 'SERVER',
  [SpanKind.CLIENT]: 'CLIENT',
  [SpanKind.PRODUCER]: 'PRODUCER',
  [SpanKind.CONSUMER]: 'CONSUMER',
};

const SPAN_STATUS_CODE: Record<SpanStatusCode, string> = {
  [SpanStatusCode.OK]: 'OK',
  [SpanStatusCode.ERROR]: 'ERROR',
  [SpanStatusCode.UNSET]: 'UNSET',
};

export class ConsoleCompactSpanExporter implements SpanExporter {
  private traceIdToIndex: Record<string, string> = {};
  private spanIdToIndex: Record<string, string> = {};

  public export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void,
  ): void {
    spans.forEach(span => {
      console.log(
        `----------------------------------------\n` +
        `     name: ${span.name}\n` +
        `     kind: ${SPAN_NAME[span.kind]}\n` +
        `   status: ${SPAN_STATUS_CODE[span.status.code]}\n` +
        `  traceId: ${this.traceIndex(span.spanContext().traceId)}\n` +
        `   spanId: ${this.spanIndex(span.spanContext().spanId)}`
      );
      if (span.parentSpanContext) {
        console.log(
          `  parentTraceId: ` +
          `${this.traceIndex(span.parentSpanContext.traceId)}\n` +
          `   parentSpanId: ${this.spanIndex(span.parentSpanContext.spanId)}`,
        );
      }
      const keys = Object.keys(span.attributes);
      keys.forEach(key => {
        console.log(`     ${key}: ${span.attributes[key]}`);
      });
    });
    resultCallback({ code: ExportResultCode.SUCCESS });
  }

  public shutdown(): Promise<void> {
    return Promise.resolve();
  }

  public forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  private traceIndex(traceId: string): string {
    if (!this.traceIdToIndex[traceId]) {
      const index = Object.keys(this.traceIdToIndex).length + 1; 
      this.traceIdToIndex[traceId] = `${index}`;
    }
    return `${this.traceIdToIndex[traceId]}|${traceId}`;
  }

  private spanIndex(spanId: string): string {
    if (!this.spanIdToIndex[spanId]) {
      const index = Object.keys(this.spanIdToIndex).length + 1; 
      this.spanIdToIndex[spanId] = `${index}`;
    }
    return `${this.spanIdToIndex[spanId]}|${spanId}`;
  }
}