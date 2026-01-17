import { Injectable } from '@nestjs/common';
import { SpanStatusCode, trace, Tracer } from "@opentelemetry/api";
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { 
  DBEntityConstraintError,
  DBEntitySpec,
  DBFieldSpec,
  DBRepository,
  FindOptions,
  Update,
  Where,
} from '../../core';
import { COLUMN_TO_FIELD_MAPPING, SQLiteResultCodes } from '../const';
import { SQLiteError, UnmappedSQLiteColumnTypeError } from '../errors';
import { SQLiteDB } from '../db';
import { SQLiteSQLBuilder } from '../services';
import { SpanImpl, withActiveSpan } from '@mealz/backend-tracing';

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

  public async insert(
    opName: string,
    entity: T,
    context: Context,
  ): Promise<void> {
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
      if (error instanceof SQLiteError) {
        if (error.errno === SQLiteResultCodes.CONSTRAINT) {
          throw new DBEntityConstraintError(
            this.getEntityName(),
            this.primaryKeyAsString(entity),
          );
        }
      }
      throw error;
    }
  }

  public async upsert(
    opName: string,
    entity: T,
    context: Context,
  ): Promise<void> {
    const statement = this.sqlBuilder.buildInsert(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      entity,
      {
        upsert: true,
      },
    );

    this.logger.verbose(
      'Running SQL upsert',
      {
        ...context,
        ...statement.toContext(),
      },
    );

    try {
      await this.db.run(statement);
    } catch (error) {
      if (error instanceof SQLiteError) {
        if (error.errno === SQLiteResultCodes.CONSTRAINT) {
          throw new DBEntityConstraintError(
            this.getEntityName(),
            this.primaryKeyAsString(entity),
            `error code is ${error.code}`,
          );
        }
      }
      throw error;
    }    
  }

  public async find<K extends keyof T>(
    opName: string,
    where: Where<T>,
    options: FindOptions<T, K>,
    context: Context,
  ): Promise<Pick<T, K>[]> {
    return withActiveSpan(
      this.getTracer(),
      `SQLite ${opName}`,
      async (span) => {
        try {
          const statement = this.sqlBuilder.buildSelect(
            this.tableName,
            this.getEntityName(),
            this.getFieldsSpec(),
            where,
            options,
          );
          span.setAttribute('sql', statement.getSQL());
          this.logger.verbose(
            'Running SQL query',
            {
              ...context,
              ...statement.toContext(),
            },
          );
          const result = await this.db.getAll(statement);
          span.ok();
          return result;
        } catch (error) {
          span.error(error);
          throw error;
        } finally {
          span.end();
        }
      },
    );
  }

  public async update(
    opName: string,
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
    opName: string,
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

  public async transaction(func: () => Promise<void>): Promise<void> {
    await this.db.transaction(func);
  }

  private getTracer(): Tracer {
    return trace.getTracer(SQLiteDBRepository.name);
  }
}
