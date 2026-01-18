import * as colors from 'ansi-colors';
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
      const spanContext = span.spanContext();
      console.log(
        `${colors.gray('----------------------------------------')}\n` +
        `      name: ${colors.cyan(span.name)}\n` +
        `      kind: ${colors.cyan(SPAN_NAME[span.kind])}\n` +
        `    status: ${colors.cyan(SPAN_STATUS_CODE[span.status.code])}\n` +
        `   traceId: ` +
        `${colors.green(this.traceIndex(spanContext.traceId))}\n` +
        `    spanId: ` +
        `${colors.green(this.spanIndex(spanContext.spanId))}`
      );
      const keys = Object.keys(span.attributes);
      if (keys.length > 0) {
        console.log(`attributes:`);
        keys.forEach(key => {
          const value = span.attributes[key];
          const valueStr = typeof value === 'string'
            ? value
            : JSON.stringify(value);
          console.log(`     ${key}: ${colors.yellow(valueStr)}`);
        });
      }
      if (span.parentSpanContext) {
        const parentContext = span.parentSpanContext;
        console.log(
          `  parentTraceId: ` +
          `${colors.green(this.traceIndex(parentContext.traceId))}\n` +
          `   parentSpanId: ` +
          `${colors.green(this.spanIndex(parentContext.spanId))}`,
        );
      }
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