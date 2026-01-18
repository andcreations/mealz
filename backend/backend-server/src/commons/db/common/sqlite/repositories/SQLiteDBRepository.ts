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
import { Span, SpanImpl, withActiveSpan } from '@mealz/backend-tracing';
import { SQLiteStatement } from '../types';

interface SQLiteColumn {
  name: string;
  type: string;
  pk: number;
}

@Injectable()
export class SQLiteDBRepository<T> extends DBRepository<T>{
  private tableName: string;
  private tracer = trace.getTracer(SQLiteDBRepository.name);

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

  private async insertWithSpan(
    opName: string,
    entity: T,
    span: Span,
    context: Context,
  ): Promise<void> {
    const statement = this.sqlBuilder.buildInsert(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      entity,
    );
    this.spanAttributes2(span, statement, opName);

    this.logger.verbose(
      'Running SQL insert',
      {
        ...context,
        ...statement.toContext(),
      },
    );

    try {
      await this.db.run(statement);
      span.ok();
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

  public async insert(
    opName: string,
    entity: T,
    context: Context,
  ): Promise<void> {
    return this.withActiveSpan(
      'INSERT',
      async (span) => {
        return await this.insertWithSpan(opName, entity, span, context);
      }
    );
  }

  private async upsertWithSpan(
    opName: string,
    entity: T,
    span: Span,
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
    this.spanAttributes2(span, statement, opName);

    this.logger.verbose(
      'Running SQL upsert',
      {
        ...context,
        ...statement.toContext(),
      },
    );

    try {
      await this.db.run(statement);
      span.ok();
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

  public async upsert(
    opName: string,
    entity: T,
    context: Context,
  ): Promise<void> {
    return this.withActiveSpan(
      'UPSERT',
      async (span) => {
        return await this.upsertWithSpan(opName, entity, span, context);
      }
    );
  }

  private async findWithSpan<K extends keyof T>(
    opName: string,
    where: Where<T>,
    options: FindOptions<T, K>,
    span: Span,
    context: Context,
  ): Promise<Pick<T, K>[]> {
    const statement = this.sqlBuilder.buildSelect(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      where,
      options,
    );
    this.spanAttributes2(span, statement, opName);
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
  }

  public async find<K extends keyof T>(
    opName: string,
    where: Where<T>,
    options: FindOptions<T, K>,
    context: Context,
  ): Promise<Pick<T, K>[]> {
    return this.withActiveSpan(
      'SELECT',
      async (span) => {
        return await this.findWithSpan(
          opName,
          where,
          options,
          span,
          context,
        );
      },
    );
  }

  private async updateWithSpan(
    opName: string,
    where: Where<T>,
    update: Update<T>,
    span: Span,
    context: Context,
  ): Promise<void> {
    const statement = this.sqlBuilder.buildUpdate(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      update,
      where,
    );
    this.spanAttributes2(span, statement, opName);
    this.logger.verbose(
      'Running SQL update',
      {
        ...context,
        ...statement.toContext(),
      },
    );

    await this.db.run(statement);
    span.ok();
  }

  public async update(
    opName: string,
    where: Where<T>,
    update: Update<T>,
    context: Context,
  ): Promise<void> {
    return this.withActiveSpan(
      'UPDATE',
      async (span) => {
        return await this.updateWithSpan(opName, where, update, span, context);
      }
    );
  }

  private async deleteWithSpan(
    opName: string,
    where: Where<T>,
    span: Span,
    context: Context,
  ): Promise<void> {
    const statement = this.sqlBuilder.buildDelete(
      this.tableName,
      this.getEntityName(),
      this.getFieldsSpec(),
      where,
    );
    this.spanAttributes2(span, statement, opName);
    this.logger.verbose(
      'Running SQL delete',
      {
        ...context,
        ...statement.toContext(),
      },
    );
    await this.db.run(statement);
    span.ok();
  }

  public async delete(
    opName: string,
    where: Where<T>,
    context: Context,
  ): Promise<void> {
    return this.withActiveSpan(
      'DELETE',
      async (span) => {
        return await this.deleteWithSpan(opName, where, span, context);
      }
    );
  }

  public async transaction(func: () => Promise<void>): Promise<void> {
    await this.db.transaction(func);
  }

  private async withActiveSpan<R>(
    dbOpName: string,
    func: (span: Span) => Promise<R>
  ): Promise<R> {
    return withActiveSpan(
      this.tracer,
      `sqlite ${dbOpName} ${this.tableName}`,
      async (span) => {
        try {
          return await func(span);
        } catch (error) {
          span.error(error);
          throw error;
        } finally {
          span.end();
        }
      }
    );
  }

  private spanAttributes2(
    span: Span,
    statement: SQLiteStatement,
    opName: string,
  ): void {
    span.setAttribute('db.op', opName);
    span.setAttribute('db.sql', statement.getSQL());
  }
}
