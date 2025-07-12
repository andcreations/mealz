import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { 
  DBEntityAlreadyExistsError,
  DBEntitySpec,
  DBFieldSpec,
  DBRepository,
  FindOptions,
  IterateCallback,
  Update,
  Where,
} from '../../core';
import { COLUMN_TO_FIELD_MAPPING, SQLiteResultCodes } from '../const';
import { SQLiteError, UnmappedSQLiteColumnTypeError } from '../errors';
import { SQLiteSQLBuilder, SQLiteDB } from '../services';

interface SQLiteColumn {
  name: string;
  type: string;
  pk: number;
}

@Injectable()
export class SQLiteDBRepository<T> extends DBRepository<T>{
  private tableName: string;

  public constructor(
    private readonly db: SQLiteDB,
    private readonly sqlBuilder: SQLiteSQLBuilder,
    private readonly logger: Logger,
  ) {
    super();
  }

  public async initSQLiteDBRepository(
    tableName: string,
    entitySpec: DBEntitySpec,
    fieldsSpec: DBFieldSpec[],
  ): Promise<void> {
    this.init(entitySpec, fieldsSpec);
    this.tableName = tableName;
  }

  public async listFields(): Promise<Pick<DBFieldSpec, 'name' | 'type'>[]> {
    const response = await this.db.pragma<SQLiteColumn[]>(
      `table_info(${this.tableName})`,
    );
    return response.map(column => {
      const type = COLUMN_TO_FIELD_MAPPING[column.type];
      if (!type) {
        throw new UnmappedSQLiteColumnTypeError(column.name, column.type);
      }
      return {
        name: column.name,
        type,
      };
    });
  }

  public async insert(entity: T, context: Context): Promise<void> {
    const statement = this.sqlBuilder.buildInsert(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      entity,
    );

    this.logger.verbose(
      'Running SQL insert',
      {
        ...context,
        ...statement.toContext(),
      },
    );

    try {
      await this.db.run(statement);
    } catch (error) {
      console.log(error);
      if (error instanceof SQLiteError) {
        if (error.errno === SQLiteResultCodes.CONSTRAINT) {
          throw new DBEntityAlreadyExistsError(this.getEntityName());
        }
      }
      throw error;
    }
  }

  public async find<K extends keyof T>(
    where: Where<T>,
    options: FindOptions<T, K>,
    context: Context,
  ): Promise<Pick<T, K>[]> {
    const statement = this.sqlBuilder.buildSelect(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      where,
      options,
    );
    this.logger.verbose(
      'Running SQL query',
      {
        ...context,
        ...statement.toContext(),
      },
    );
    
    const rows: Pick<T, K>[] = [];
    await this.db.each(statement, (row) => {
      rows.push(row);
    });
    return rows;
  }

  public async iterate<K extends keyof T>(
    where: Where<T>,
    options: Omit<FindOptions<T, K>, 'limit'>,
    callback: IterateCallback<Pick<T, K>>,
    context: Context,
  ): Promise<void> {
    const statement = this.sqlBuilder.buildSelect(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      where,
      options,
    );
    this.logger.verbose(
      'Running SQL query',
      {
        ...context,
        ...statement.toContext(),
      },
    );

    await this.db.each(statement, (row) => {
      callback.onNext(row);
    });
    callback.onComplete();
  }

  public async update(
    where: Where<T>,
    update: Update<T>,
    context: Context,
  ): Promise<void> {
    const statement = this.sqlBuilder.buildUpdate(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      update,
      where,
    );
    this.logger.verbose(
      'Running SQL update',
      {
        ...context,
        ...statement.toContext(),
      },
    );

    await this.db.run(statement);
  }

  public async delete(
    where: Where<T>,
    context: Context,
  ): Promise<void> {
    const statement = this.sqlBuilder.buildDelete(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      where,
    );
    this.logger.verbose(
      'Running SQL delete',
      {
        ...context,
        ...statement.toContext(),
      },
    );
    await this.db.run(statement);
  }
}
