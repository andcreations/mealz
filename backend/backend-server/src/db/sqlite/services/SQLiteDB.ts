import * as path from 'path';
import * as fs from 'fs';
import * as sqlite3 from 'better-sqlite3';
import { Inject, Injectable } from '@nestjs/common';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { UnknownDBError } from '../../core';
import { SQLITE_DBE_MODULE_OPTIONS } from '../const';
import { SQLiteDBModuleOptions } from '../SQLiteDBModule';
import { SQLiteError } from '../errors';
import { SQLiteStatement } from '../types';
import { SQLiteDBBackup } from './SQLiteDBBackup';

@Injectable()
export class SQLiteDB {
  private db: sqlite3.Database;

  constructor(
    @Inject(SQLITE_DBE_MODULE_OPTIONS)
    private readonly options: SQLiteDBModuleOptions,
    private readonly logger: Logger,
    backup: SQLiteDBBackup,
  ) {
    backup.register(this);
  }

  public getOptions(): SQLiteDBModuleOptions {
    return this.options;
  }
  
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
      try {
        this.db = sqlite3(this.options.dbFilename);
        this.db.pragma('journal_mode = WAL');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public async backup(file: string): Promise<void> {
    await this.db.backup(file);
  }

  public async pragma<TResponse>(statement: string): Promise<TResponse> {
    const func = () =>
      new Promise<TResponse>((resolve, reject) => {
        try {
          const result = this.db.pragma(`${statement}`);
          resolve(result as TResponse);
        } catch (error) { 
          reject(error);
        }
      });
    return this.handleError(func);
  }

  public async run(statement: SQLiteStatement | string): Promise<void> {
    if (typeof statement === 'string') {
      statement = new SQLiteStatement(statement);
    }
    const func = () =>
      new Promise<void>((resolve, reject) => {
        try {
          const sqliteStatement = this.db.prepare(statement.getSQL());
          sqliteStatement.run(statement.getParams());
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    return this.handleError(func);
  }

  public async getAll<T = any>(
    statement: SQLiteStatement,
  ): Promise<T[]> {
    const func = () =>
      new Promise<T[]>((resolve, reject) => {
        try {
          const sqliteStatement = this.db.prepare<unknown[], T>(
            statement.getSQL(),
          );
          const result = sqliteStatement.all(statement.getParams());
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    return this.handleError<T[]>(func);
  }

  public async transaction(func: () => Promise<void>): Promise<void> {
    await this.run('BEGIN TRANSACTION');
    try {
      await func();
    } catch (error) {
      await this.run('ROLLBACK TRANSACTION');
      throw error;
    }
    await this.run('COMMIT TRANSACTION');
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