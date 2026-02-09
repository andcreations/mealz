import {
  SpanExporter,
  ConsoleSpanExporter,
  SpanProcessor,
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Instrumentation } from '@opentelemetry/instrumentation';
import {
  getNodeAutoInstrumentations
} from '@opentelemetry/auto-instrumentations-node';
import { ExpressLayerType } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
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
import { IncomingMessage } from 'http';

const EXPORTER_TYPES = ['console-compact','console', 'http'];
const PROCESSOR_TYPES = ['simple', 'batch'];

const IGNORE_PATHS = [
  '/api/v1/health',
  '/api/v1/metrics',
];

let sdk: NodeSDK;
let shuttingDown = false;

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
        `Invalid tracing exporter ${MealzError.quote(type)}. ` +
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

function createInstrumentations(): Instrumentation[] {
  return getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-dns': {
      enabled: false,
    }, 
    '@opentelemetry/instrumentation-nestjs-core': {
      enabled: false,
    },
    '@opentelemetry/instrumentation-net': {
      enabled: false,
    },  
    '@opentelemetry/instrumentation-express': {
      ignoreLayers: ['/api/v1/metrics'],
      ignoreLayersType: [
        ExpressLayerType.MIDDLEWARE,
        ExpressLayerType.REQUEST_HANDLER,
        ExpressLayerType.ROUTER,
      ],
    },
    '@opentelemetry/instrumentation-http': {
      enabled: true,
      ignoreIncomingRequestHook: (request: IncomingMessage): boolean => {
        const url = request.url;
        if (!url) {
          return false;
        }
        return IGNORE_PATHS.some(path => url.startsWith(path));
      }
    },
  });
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
    instrumentations: createInstrumentations(),
  });

  // start
  sdk.start()
  getLogger().info('Tracing initialized', {
    correlationId: BOOTSTRAP_CONTEXT.correlationId,
  });
}

export async function shutdownTracing(): Promise<void> {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

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
