import * as apiLogs from '@opentelemetry/api-logs';
import { 
  LoggerProvider,
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LogRecordExporter,
} from '@opentelemetry/sdk-logs';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { Context, contextToAttributes } from '@mealz/backend-core';
import {
  getStrEnv,
  InternalError,
  MealzError,
  requireStrEnv,
} from '@mealz/backend-common';
import { getCurrentTraceAndSpanId } from '@mealz/backend-tracing';

import { Logger } from './Logger';

const EXPORTER_TYPES = ['console','http'];

export class OpenTelemetryLogger extends Logger {
  private logger: apiLogs.Logger;
  private loggerProvider: LoggerProvider;
  private logExporter: LogRecordExporter;

  public constructor() {
    super();
  }

  private createExporter(): LogRecordExporter {
    const type = getStrEnv('MEALZ_OTEL_LOG_EXPORTER', 'console');
    switch (type) {
      case 'console':
        return new ConsoleLogRecordExporter();
      case 'http':
        const url = requireStrEnv('MEALZ_OTEL_LOG_EXPORTER_ENDPOINT');
        const token = requireStrEnv('MEALZ_OTEL_LOG_EXPORTER_TOKEN');
        return new OTLPLogExporter({
          url,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          compression: CompressionAlgorithm.GZIP,
        });
      default:
        throw new InternalError(
          `Invalid OpenTelemetry log exporter ${MealzError.quote(type)}. ` +
          `Valid types are ${MealzError.quote(EXPORTER_TYPES)}`,
        );
    }
  }

  public init(): void {
    // exporter
    this.logExporter = this.createExporter();

    // provider
    this.loggerProvider = new LoggerProvider({
      processors: [
        new BatchLogRecordProcessor(this.logExporter),
      ],
    });

    // set logger provider
    apiLogs.logs.setGlobalLoggerProvider(this.loggerProvider);
    this.logger = apiLogs.logs.getLogger('mealz');
  }

  private emitLogRecord(
    severityNumber: apiLogs.SeverityNumber,
    severityText: string,
    msg: string,
    context: Context,
  ): void {
    const { traceId, spanId } = getCurrentTraceAndSpanId();

    const logRecord: apiLogs.LogRecord = {
      severityNumber,
      severityText,
      body: msg,
      timestamp: performance.now(),
      attributes: {
        ...contextToAttributes(context),
        ...(traceId ? { trace_id: traceId } : {}),
        ...(spanId ? { span_id: spanId } : {}),
      },
      ...(context.eventName ? { eventName: context.eventName } : {}),
    };
    this.logger.emit(logRecord);
  }

  public verbose(msg: string, context: Context): void {
    this.emitLogRecord(apiLogs.SeverityNumber.TRACE, 'TRACE', msg, context);
  }

  public debug(msg: string, context: Context): void {
    this.emitLogRecord(apiLogs.SeverityNumber.DEBUG, 'DEBUG', msg, context);
  }

  public info(msg: string, context: Context): void {
    this.emitLogRecord(apiLogs.SeverityNumber.INFO, 'INFO', msg, context);
  }

  public warning(msg: string, context: Context): void {
    this.emitLogRecord(apiLogs.SeverityNumber.WARN, 'WARN', msg, context);
  }

  public error(msg: string, context: Context, error?: any): void {
    let errorContext: Omit<Context, 'correlationId'> = {};
    if (error && error instanceof Error) {
      errorContext = {
        error: error.message,
        stack: error.stack.toString(),
      };
    }
    else {
      errorContext = {
        error: error?.toString() ?? 'Unknown error',
      };
    }
    this.emitLogRecord(
      apiLogs.SeverityNumber.ERROR,
      'ERROR',
      msg,
      {
        ...context,
        ...errorContext,
      }
    );
  }
}