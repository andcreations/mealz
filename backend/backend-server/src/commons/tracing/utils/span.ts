import { Span as OTLSpan, trace, Tracer } from '@opentelemetry/api';

import { isTracingEnabled } from './tracing';
import { DummySpan, Span, SpanImpl } from '../types';

export function withActiveSpan<T>(
  tracer: Tracer,
  spanName: string,
  func: (span: Span) => Promise<T>,
): Promise<T> {
  if (!isTracingEnabled()) {
    return func(new DummySpan());
  }
  return tracer.startActiveSpan(spanName, (otlSpan: OTLSpan) => {
    return func(new SpanImpl(otlSpan));
  });
}