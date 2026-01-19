import { context, trace } from '@opentelemetry/api';
import { getBoolEnv } from '@mealz/backend-common';

export function isTracingEnabled(): boolean {
  return getBoolEnv('MEALZ_TRACING_ENABLED', false);
}

export function getCurrentTraceAndSpanId(): TraceAndSpanId {
  const span = trace.getSpan(context.active());
  if (!span) return {
    traceId: undefined,
    spanId: undefined,
  };

  return {
    traceId: span.spanContext().traceId,
    spanId: span.spanContext().spanId,
  };
}

export interface TraceAndSpanId {
  traceId?: string;
  spanId?: string;
}