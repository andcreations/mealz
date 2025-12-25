import { Logtail } from '@logtail/node';
import { Context } from '@mealz/backend-core';

import { requireStrEnv } from '@mealz/backend-common';
import { Logger } from './Logger';

export class LogtailLogger extends Logger {
  private readonly logtail: Logtail;

  public constructor() {
    super();
    this.logtail = new Logtail(
      requireStrEnv('MEALZ_LOGTAIL_SOURCE_TOKEN'),
      {
        endpoint: requireStrEnv('MEALZ_LOGTAIL_ENDPOINT'),
      }
    );
  }

  public verbose(msg: string, context: Context): void {
    this.logtail.debug(msg, context);
  }

  public debug(msg: string, context: Context): void {
    this.logtail.debug(msg, context);
  }

  public info(msg: string, context: Context): void {
    this.logtail.info(msg, context);
  }

  public warning(msg: string, context: Context): void {
    this.logtail.warn(msg, context);
  }

  public error(msg: string, context: Context, error?: any): void {
    let errorStack: string;
    let errorMessage: string;
    if (error instanceof Error) {
      errorStack = error.stack;
      errorMessage = error.message ?? 'Unknown error';
    }
    else {
      errorMessage = error?.toString() ?? 'Unknown error';
    }
    this.logtail.error(msg, {
      ...context,
      error: errorMessage,
      stack: errorStack,
    });
  }
}