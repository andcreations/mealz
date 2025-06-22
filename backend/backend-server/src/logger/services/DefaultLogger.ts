import { Context } from '#mealz/backend-core';

import { LogLevel } from '../enums';
import { Logger } from './Logger';

export abstract class DefaultLogger extends Logger {
  protected abstract log(level: LogLevel, msg: string, context: Context): void;

  verbose(msg: string, context: Context): void {
    this.log(LogLevel.VERBOSE, msg, context);
  }

  debug(msg: string, context: Context): void {
    this.log(LogLevel.DEBUG, msg, context);
  }

  info(msg: string, context: Context): void {
    this.log(LogLevel.INFO, msg, context);
  }

  warning(msg: string, context: Context): void {
    this.log(LogLevel.WARNING, msg, context);
  }

  error(msg: string, context: Context, error?: any): void {
    if (error && error instanceof Error) {
      this.log(LogLevel.ERROR, msg, {
        ...context,
        stack: error.stack,
        error: error.toString()
      });
      return;
    }
    this.log(LogLevel.ERROR, msg, {
      ...context,
      error: error?.toString() ?? 'Unknown error'
    });
  }
}