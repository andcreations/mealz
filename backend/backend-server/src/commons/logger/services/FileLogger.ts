import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { requireStrEnv } from '@mealz/backend-common';

import { LogLevel } from '../enums';
import { DefaultLogger } from './DefaultLogger';

@Injectable()
export class FileLogger extends DefaultLogger {
  private output: fs.WriteStream;

  public constructor() {
    super();
    const fileName = requireStrEnv('MEALZ_LOG_FILE');
    this.output = fs.createWriteStream(fileName, { flags: 'a+' })
  }

  private logString(str: string): void {
    this.output.write(str + '\n');
  }

  protected log(level: LogLevel, msg: string, context: Context): void {
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    this.logString(`${this.now()} | ${level} | ${msg}${contextStr}`);
  }

}