import {
  SpanExporter,
  ConsoleSpanExporter,
  SpanProcessor,
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  getNodeAutoInstrumentations
} from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BOOTSTRAP_CONTEXT, SHUTDOWN_CONTEXT } from '@mealz/backend-core';
import {
  getStrEnv,
  InternalError,
  MealzError,
  requireStrEnv,
} from '@mealz/backend-common';
import { getLogger } from '@mealz/backend-logger';
import { isTracingEnabled } from '@mealz/backend-tracing';

import { ConsoleCompactSpanExporter } from './ConsoleCompactSpanExporter';

const EXPORTER_TYPES = ['console-compact','console', 'http'];
const PROCESSOR_TYPES = ['simple', 'batch'];
let sdk: NodeSDK;

function createExporter(): SpanExporter {
  const type = getStrEnv('MEALZ_TRACING_EXPORTER', 'console');

  switch (type) {
    case 'console-compact':
      return new ConsoleCompactSpanExporter();

    case 'console':
      return new ConsoleSpanExporter();

    case 'http':
      const url = requireStrEnv('MEALZ_TRACING_HTTP_EXPORTER_URL');
      const token = requireStrEnv('MEALZ_TRACING_HTTP_EXPORTER_TOKEN');
      return new OTLPTraceExporter({
        url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    default:
      throw new InternalError(
        `Invalid tracing exporter type ${MealzError.quote(type)}. ` +
        `Valid types are ${MealzError.quote(EXPORTER_TYPES)}`,
      );
  }
}

function createSpanProcessor(exporter: SpanExporter): SpanProcessor {
  const type = getStrEnv('MEALZ_TRACING_SPAN_PROCESSOR', 'simple');
  switch (type) {
    case 'simple':
      return new SimpleSpanProcessor(exporter);

    case 'batch':
      return new BatchSpanProcessor(exporter);

    default:
      throw new InternalError(
        `Invalid tracing span processor type ${MealzError.quote(type)}. ` +
        `Valid types are ${MealzError.quote(PROCESSOR_TYPES)}`,
      );
  }
}

export function bootstrapTracing() {
  // create
  const exporter = createExporter();
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      // TODO OpenTelemetry attributes
      // [ATTR_SERVICE_NAME]: '',
      // [ATTR_SERVICE_VERSION]: '',
    }),
    traceExporter: exporter,
    spanProcessors: [createSpanProcessor(exporter)],
    instrumentations: [getNodeAutoInstrumentations()],
  });

  // start
  sdk.start()
  getLogger().info('Tracing initialized', {
    correlationId: BOOTSTRAP_CONTEXT.correlationId,
  });
}

export async function shutdownTracing(): Promise<void> {
  if (sdk) {
    getLogger().info('Shutting down tracing', SHUTDOWN_CONTEXT);
    sdk.shutdown().catch((error) => {
      getLogger().error(
        'Failed to shutdown tracing',
        SHUTDOWN_CONTEXT,
        error,
      );
    });
  }
}

if (isTracingEnabled()) {
  bootstrapTracing();
  process.on('SIGTERM', shutdownTracing);
  process.on('SIGINT', shutdownTracing);
}
else {
  getLogger().info('Tracing disabled', BOOTSTRAP_CONTEXT);
}
