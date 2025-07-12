import * as YAML from 'yaml';
import { Context } from '@mealz/backend-core';

export abstract class Logger {
  protected now(): string {
    return new Date().toISOString();
  }

  private toYAML(context: Context): string {
    const lines = YAML.stringify(context).split('\n');
    let yaml = '';
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      if (index === lines.length - 1 && line.length === 0) {
        continue;
      }

      if (index) {
        yaml += '\n';
      }
      yaml += '  ' + line;
    }
    return yaml;
  }

  private stringifyContext(context: any): string {
    const jsonFormat = !!process.env.MEALZ_LOG_JSON;
    return jsonFormat ? JSON.stringify(context) : '\n' + this.toYAML(context);
  }

  protected contextToStr(context: Context): string {
    return context ? this.stringifyContext(context) : '';
  }

  abstract verbose(msg: string, context: Context): void;

  abstract debug(msg: string, context: Context): void;

  abstract info(msg: string, context: Context): void;

  abstract warning(msg: string, context: Context): void;

  abstract error(msg: string, context: Context, error?: any): void;
}