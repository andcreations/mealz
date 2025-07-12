import * as path from 'path';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
import { Inject, Injectable } from '@nestjs/common';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { UnknownDBError } from '../../core';
import { SQLITE_DBE_MODULE_OPTIONS } from '../const';
import { SQLiteDBModuleOptions } from '../SQLiteDBModule';
import { SQLiteError } from '../errors/SQLiteError';
import { SQLiteStatement } from '../types';

@Injectable()
export class SQLiteDB {
  private db: sqlite3.Database;

  constructor(
    @Inject(SQLITE_DBE_MODULE_OPTIONS)
    private readonly options: SQLiteDBModuleOptions,
    private readonly logger: Logger,
  ) {}

  public async init(): Promise<void> {
    this.logger.debug('Initializing SQLite', {
      ...BOOTSTRAP_CONTEXT,
      name: this.options.name,
      dbFilename: this.options.dbFilename,
    });

    const dir = path.dirname(this.options.dbFilename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(
        this.options.dbFilename,
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          this.logger.debug('Initialized SQLite', {
            ...BOOTSTRAP_CONTEXT,
            name: this.options.name,
          });
          resolve();
        },
      );
    });
  }

  public async pragma<TResponse>(statement: string): Promise<TResponse> {
    const func = () =>
      new Promise<TResponse>((resolve, reject) => {
        this.db.all(`PRAGMA ${statement}`, (error, rows) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(rows as TResponse);
        });
      });
    return this.handleError(func);
  }

  public async run(statement: SQLiteStatement): Promise<void> {
    const func = () =>
      new Promise<void>((resolve, reject) => {
        this.db.run(
          statement.getSQL(),
          statement.getParams(),
          (error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          },
        );
      });
    return this.handleError(func);
  }

  public async each(
    statement: SQLiteStatement,
    callback: (row: any) => void,
  ): Promise<void> {
    const func = () =>
      new Promise<void>((resolve, reject) => {
        this.db.each(
          statement.getSQL(),
          statement.getParams(),
          (error, row) => {
            if (error) {
              reject(error);
              return; 
            }
            callback(row);
          },
          (err, _rowCount) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          },
        );
      });
    return this.handleError(func);
  }

  private async handleError<T>(func: () => Promise<T>): Promise<T> {
    try {
      return await func();
    } catch (error) {
      if (SQLiteError.isSQLiteError(error)) {
        throw new SQLiteError(error.errno, error.code, error.message);
      }
      throw new UnknownDBError(error);
    }
  }
}