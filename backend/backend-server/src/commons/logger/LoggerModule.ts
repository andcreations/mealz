import { Module } from '@nestjs/common';
import { 
  getStrEnv, 
  getBoolEnv, 
  InternalError, 
  MealzError,
} from '@mealz/backend-common';

import {
  Logger,
  ConsoleLogger,
  FileLogger,
  LogtailLogger,
  OpenTelemetryLogger,
  MultiLogger,
} from './services';

let logger: Logger;

export function getLogger(): Logger {
  if (logger) {
    return logger;
  }

  const logTypes = getStrEnv('MEALZ_LOG_TYPE', 'console').split(',');
  const loggers: Logger[] = [];
  for (const logType of logTypes) {
    let partialLogger: Logger;
    switch (logType) {
      case 'console':
        partialLogger = new ConsoleLogger({
          colors: getBoolEnv('MEALZ_LOG_COLORS', true),
        });
        break;
      case 'file':
        partialLogger = new FileLogger();
        break;
      case 'logtail':
        partialLogger = new LogtailLogger();
        break;
      case 'opentelemetry':
        partialLogger = new OpenTelemetryLogger();
        break;
      default:
        throw new InternalError(
          `Invalid log type ${MealzError.quote(logType)}`,
        );
    }
    loggers.push(partialLogger);
  }

  logger = new MultiLogger(loggers);
  return logger;
}

export async function initLogger(): Promise<void> {
  const logger = getLogger();
  await logger.init();
}

@Module({
  providers: [
    {
      provide: Logger,
      useValue: getLogger(),
    },
  ],
  exports: [
    Logger,
  ]
})
export class LoggerModule {}