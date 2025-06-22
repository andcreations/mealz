import { Module } from '@nestjs/common';
import { getStrEnv, getBoolEnv } from '#mealz/backend-common';

import {
  Logger,
  ConsoleLogger,
  FileLogger,
} from './services';

let logger: Logger;

export function getLogger(): Logger {
  if (logger) {
    return logger;
  }

  const logFile = getStrEnv('MEALZ_LOG_FILE');
  if (logFile) {
    logger = new FileLogger(logFile);
  } else {
    logger = new ConsoleLogger({
      colors: getBoolEnv('MEALZ_LOG_COLORS', true),
    });
  }

  return logger;
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
export class LoggerModule {
}