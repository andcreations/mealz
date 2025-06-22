import { Injectable } from '@nestjs/common';
import { Context } from '#mealz/backend-core';
import { Logger } from '#mealz/backend-logger';

import { 
  DBEntityAlreadyExistsError,
  DBFieldSpec,
  DBFieldType,
  DBRepository,
  FindOptions,
  IterateCallback,
  MissingRequiredDBFieldError,
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
  public constructor(
    private readonly db: SQLiteDB,
    private readonly sqlBuilder: SQLiteSQLBuilder,
    private readonly logger: Logger,
  ) {
    super();
  }

  public async listFields(
    entityName: string,
  ): Promise<Pick<DBFieldSpec, 'name' | 'type'>[]> {
    const response = await this.db.pragma<SQLiteColumn[]>(
      `table_info(${entityName})`,
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

  public async insert(entity: T): Promise<void> {
    const columns: string[] = [];
    const values: string[] = [];

    this.getFieldsSpec().forEach(fieldSpec => {
      const value = entity[fieldSpec.name];
      
      // non-optional fields must have a value
      if (!fieldSpec.optional && value === undefined) {
        throw new MissingRequiredDBFieldError(
          this.getEntityName(),
          fieldSpec.name,
        );
      }

      // skip undefined values
      if (value === undefined) {
        return;
      }

      columns.push(fieldSpec.name);
      values.push(this.getValueForSQL(value, fieldSpec.type));
    });

    // insert
    const statement =
      `INSERT INTO ${this.getEntityName()} ` +
     `(${columns.join(',')}) VALUES (${values.join(',')})`;
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

  private getValueForSQL(value: string, type: DBFieldType) {
    if (type === DBFieldType.STRING) {
      return `'${value}'`;
    }
    return value;
  }

  public async find<K extends keyof T>(
    where: Where<T>,
    options: FindOptions<T, K>,
    context: Context,
  ): Promise<Pick<T, K>[]> {
    const sql = this.sqlBuilder.buildSelect(
      this.getEntityName(),
      this.getFieldsSpec(),
      where,
      options,
    );
    this.logger.verbose('Running SQL query', { ...context, sql });
    
    const rows: Pick<T, K>[] = [];
    await this.db.each(sql, (row) => {
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
    const sql = this.sqlBuilder.buildSelect(
      this.getEntityName(),
      this.getFieldsSpec(),
      where,
      options,
    );
    this.logger.verbose(
      `Running SQL query [entity:${this.getEntityName()}]`,
      {
        ...context,
        entity: this.getEntityName(),
        sql,
      },
    );

    await this.db.each(sql, (row) => {
      callback.onNext(row);
    });
    callback.onComplete();
  }

  public async update(
    where: Where<T>,
    update: Update<T>,
    context: Context,
  ): Promise<void> {
    let sql = `UPDATE ${this.getEntityName()} SET`;

    // set
    sql += ' ' + this.sqlBuilder.buildUpdateSet(
      this.getEntityName(),
      this.getFieldsSpec(),
      update,
    );

    // where
    const sqlWhere = this.sqlBuilder.buildWhere(
      this.getEntityName(),
      where,
      this.getFieldsSpec(),
    );
    if (sqlWhere) {
      sql += ` WHERE ${sqlWhere}`;
    }

    this.logger.verbose(
      `Running SQL update`,
      {
        ...context,
        entity: this.getEntityName(),
        sql,
      },
    );
    await this.db.run(sql);
  }

  public async delete(
    where: Where<T>,
    context: Context,
  ): Promise<void> {
    let sql = `DELETE FROM ${this.getEntityName()}`;

    const sqlWhere = this.sqlBuilder.buildWhere(
      this.getEntityName(),
      where,
      this.getFieldsSpec(),
    );
    if (sqlWhere) {
      sql += ` WHERE ${sqlWhere}`;
    }

    this.logger.verbose(
      `Running SQL delete`,
      {
        ...context,
        entity: this.getEntityName(),
        sql,
      },
    );
    await this.db.run(sql);
  }
}
