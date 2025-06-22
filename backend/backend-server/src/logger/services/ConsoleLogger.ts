import * as colors from 'ansi-colors';
import { Injectable } from '@nestjs/common';
import { Context } from '#mealz/backend-core';

import { LogLevel } from '../enums';
import { DefaultLogger } from './DefaultLogger';

export interface ConsoleLoggerOptions {
  colors?: boolean;
}

@Injectable()
export class ConsoleLogger extends DefaultLogger {
  private LEVEL_TO_COLOR: Record<LogLevel, (str: string) => string> = {
    [LogLevel.VERBOSE]: colors.gray,
    [LogLevel.DEBUG]: colors.gray,
    [LogLevel.INFO]: colors.white,
    [LogLevel.WARNING]: colors.yellow,
    [LogLevel.ERROR]: colors.red,
  };

  public constructor(private readonly options: ConsoleLoggerOptions) {
    super();
  }

  private color(str: string, color: (str: string) => string): string {
    return this.options.colors ? color(str) : str;
  }

  protected log(level: LogLevel, msg: string, context: Context): void {
    const levelStr = this.color(level, this.LEVEL_TO_COLOR[level]);
    const contextStr = context
      ? ` | ${this.color(this.contextToStr(context), colors.gray)}`
      : '';
    console.log(`${this.now()} | ${levelStr} | ${msg}${contextStr}`);
  }
}