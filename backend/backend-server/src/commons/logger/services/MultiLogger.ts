import { Context } from '@mealz/backend-core';
import { Logger } from './Logger';

export class MultiLogger extends Logger {
  public constructor(
    private readonly loggers: Logger[],
  ) {
    super();
  }

  public verbose(msg: string, context: Context): void {
    this.loggers.forEach((logger) => logger.verbose(msg, context));
  }

  public debug(msg: string, context: Context): void {
    this.loggers.forEach((logger) => logger.debug(msg, context));
  }

  public info(msg: string, context: Context): void {
    this.loggers.forEach((logger) => logger.info(msg, context));
  }

  public warning(msg: string, context: Context): void {
    this.loggers.forEach((logger) => logger.warning(msg, context));
  }

  public error(msg: string, context: Context, error?: any): void {
    this.loggers.forEach((logger) => logger.error(msg, context, error));
  }
}