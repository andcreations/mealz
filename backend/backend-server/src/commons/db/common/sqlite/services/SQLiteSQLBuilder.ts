import { Injectable } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

import {
  DBFieldSpec,
  WHERE_AND,
  WHERE_OR, 
  Where,
  WhereAnd,
  WhereOr,
  WhereOperator,
  DBFieldType,
  FindOptions,
  InvalidFindOptionsError,
  Update,
  UpdateOperator,
  MissingRequiredDBFieldError,
} from '../../core';
import { SQLITE_FALSE, SQLITE_TRUE } from '../const';
import { SQLiteInvalidValueError, SQLiteWhereBuildError } from '../errors';
import { SQLiteParamValue, SQLiteStatement } from '../types';

class SQLiteStatementContext {
  private paramIndex = 0;

  public nextParam(prefix: string): string {
    return '?';
  }
}

@Injectable()
export class SQLiteSQLBuilder {
  private buildMulti<T>(
    entityName: string,
    whereList: Where<T>[],
    fieldsSpec: DBFieldSpec[],
    operator: string,
    context: SQLiteStatementContext,
  ): SQLiteStatement {
    const statement: SQLiteStatement = new SQLiteStatement('(');

    whereList.forEach((subWhere, index) => {
      if (index > 0) {
        statement.appendSQL(` ${operator} `);
      }
      const subWhereResult = this.buildWhere<T>(
        entityName,
        subWhere,
        fieldsSpec,
        context,
      );
      statement.append(subWhereResult);
    });

    statement.appendSQL(')');
    return statement;
  }

  private buildOr<T>(
    entityName: string,
    where: WhereOr<T>,
    fieldsSpec: DBFieldSpec[],
    context: SQLiteStatementContext,
  ): SQLiteStatement {
    return this.buildMulti(
      entityName,
      where[WHERE_OR],
      fieldsSpec,
      'OR',
      context,
    );
  }

  private buildAnd<T>(
    entityName: string,
    where: WhereAnd<T>,
    fieldsSpec: DBFieldSpec[],
    context: SQLiteStatementContext,
  ): SQLiteStatement {
    return this.buildMulti(
      entityName,
      where[WHERE_AND],
      fieldsSpec,
      'AND',
      context,
    );
  }

  private assertType(
    entityName: string,
    expectedTypes: DBFieldType[],
    fieldsSpec: DBFieldSpec[],
    field: string,
  ) {
    const spec = fieldsSpec.find(itr => itr.name === field);
    if (!spec) {
      throw new SQLiteWhereBuildError(
        entityName,
        `${field} is not a valid field`,
      );
    }
    if (!expectedTypes.includes(spec.type)) {
      throw new SQLiteWhereBuildError(
        entityName,
        `${field} is not a ${expectedTypes.join(' or ')}`,
      );
    }
  }

  private assertNumber(
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    field: string,
  ) {
    this.assertType(entityName, [DBFieldType.INTEGER], fieldsSpec, field);
  }

  private assertString(
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    field: string,
  ) {
    this.assertType(entityName, [DBFieldType.STRING], fieldsSpec, field);
  }

  private getSQLValue(
    entityName: string,
    value: any,
  ): string | Buffer {
    if (Array.isArray(value)) {
      throw new SQLiteInvalidValueError(
        entityName,
        `Array not as a SQL value`,
      );
    }

    if (value instanceof Buffer) {
      return value;
    }

    let sqlValue = '';
    const valueType = typeof value;
    switch (valueType) {
      case 'string':
        sqlValue = `${value}`;
        break;
      case 'number':
        sqlValue = value.toString();
        break;
      case 'boolean':
        sqlValue = value ? SQLITE_TRUE.toString() : SQLITE_FALSE.toString();
        break;
    }
    return sqlValue;    
  }

  private getSingleSQLValueForWhere(
    entityName: string,
    value: WhereOperator[keyof WhereOperator],
  ): string {
    if (Array.isArray(value)) {
      throw new SQLiteInvalidValueError(
        entityName,
        `Array not supported in where clause`,
      );
    }

    const sqlValue = this.getSQLValue(entityName, value);
    if (typeof sqlValue !== 'string') {
      throw new SQLiteInvalidValueError(
        entityName,
        `Value not a string in where clause`,
      );
    }

    return sqlValue;
  }

  private buildFieldWhere<T>(
    entityName: string,
    field: string,
    where: WhereOperator,
    fieldsSpec: DBFieldSpec[],
    context: SQLiteStatementContext,
  ): SQLiteStatement {
    const PLACEHOLDER = '{}';
    let statement: SQLiteStatement = new SQLiteStatement();

    const appendOne = (sql: string, value: string) => {
      const param = context.nextParam('where');
      statement.append(new SQLiteStatement(
        sql.replace(PLACEHOLDER, param),
        [value],
      ));
    };
    const appendArray = (sql: string, items: Array<string | number>) => {
      let itemsSql = '';
      items.forEach((item, index) => {
        const param = context.nextParam('where');
        statement.addParam(item);

        if (index > 0) {
          itemsSql += ',';
        }
        itemsSql += param;
      });
      statement.append(new SQLiteStatement(
        sql.replace(PLACEHOLDER, itemsSql),
      ));
    };

    Object.keys(where).forEach((operator, index) => {
      if (index > 0) {
        statement.appendSQL(' AND ');
      }
      const value = where[operator];
  
      switch (operator) {
        case '$eq':
          appendOne(
            `${field} = ${PLACEHOLDER}`,
            this.getSingleSQLValueForWhere(entityName, value),
          );
          break;
        case '$ne':
          appendOne(
            `${field} != ${PLACEHOLDER}`,
            this.getSingleSQLValueForWhere(entityName, value),
          );
          break;
        case '$gt':
          appendOne(
            `${field} > ${PLACEHOLDER}`,
            this.getSingleSQLValueForWhere(entityName, value),
          );
          break;
        case '$gte':
          appendOne(
            `${field} >= ${PLACEHOLDER}`,
            this.getSingleSQLValueForWhere(entityName, value),
          );
          break;
        case '$lt':
          appendOne(
            `${field} < ${PLACEHOLDER}`,
            this.getSingleSQLValueForWhere(entityName, value),
          );
          break;
        case '$lte':
          appendOne(
            `${field} <= ${PLACEHOLDER}`,
            this.getSingleSQLValueForWhere(entityName, value),
          );
          break;
        case '$in':
          appendArray(`${field} IN (${PLACEHOLDER})`, value);
          break;
        case '$nin':
          appendArray(`${field} NOT IN (${PLACEHOLDER})`, value);
          break;
        case '$like':
          this.assertString(entityName, fieldsSpec, field);
          appendOne(
            `${field} LIKE ${PLACEHOLDER}`,
            this.getSingleSQLValueForWhere(entityName, value),
          );
          break;
        default:
          throw new SQLiteWhereBuildError(
            entityName,
            `Unknown operator ${operator}`,
          );
      }
    });

    return statement;
  }

  private buildWhere<T>(
    entityName: string,
    where: Where<T>,
    fieldsSpec: DBFieldSpec[],
    context: SQLiteStatementContext,
  ): SQLiteStatement {
    const keys = Object.keys(where);
    if (keys.length === 0) {
      return new SQLiteStatement();
    }
    const isSingleKey = keys.length === 1;

    // or
    const hasOr = keys.includes(WHERE_OR);
    if (hasOr) {
      if (!isSingleKey) {
        throw new SQLiteWhereBuildError(
          entityName,
          `${WHERE_OR} is not supported with multiple conditions`
        );
      }
      return this.buildOr(
        entityName,
        where as WhereOr<T>,
        fieldsSpec,
        context,
      );
    }

    // and
    const hasAnd = keys.includes(WHERE_AND);
    if (hasAnd) {
      if (!isSingleKey) {
        throw new SQLiteWhereBuildError(
          entityName,
          `${WHERE_AND} is not supported with multiple conditions`
        );
      }
      return this.buildAnd(
        entityName,
        where as WhereAnd<T>,
        fieldsSpec,
        context,
      );
    }
   
    // field conditions
    let whereStatement: SQLiteStatement = new SQLiteStatement();
    Object.keys(where).forEach((field, index) => {
      if (index > 0) {
        whereStatement.appendSQL(' AND ');
      }
      const fieldWhereStatement = this.buildFieldWhere(
        entityName,field,
        where[field],
        fieldsSpec,
        context,
      );
      whereStatement.append(fieldWhereStatement);
    });

    return whereStatement;
  }

  public buildSelect<T>(
    tableName: string,
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    where?: Where<T>,
    options?: FindOptions<T, keyof T>,
  ): SQLiteStatement {
    const context = new SQLiteStatementContext();
    let statement = new SQLiteStatement('SELECT');

    // projection
    const { projection } = options;
    if (projection) {
      statement.appendSQL(` ${projection.join(',')}`);
    } else {
      statement.appendSQL(` *`);
    }

    // where
    statement.appendSQL(` FROM ${tableName}`);
    const sqlWhereStatement = this.buildWhere(
      entityName,
      where,
      fieldsSpec,
      context,
    );
    if (sqlWhereStatement.hasSQL()) {
      statement.appendSQL(` WHERE `);
      statement.append(sqlWhereStatement);
    }

    // sort
    const { sort } = options;
    if (sort && sort.length > 0) {
      statement.appendSQL(` ORDER BY`);
      sort.forEach((entry, index) => {
        if (index > 0) {
          statement.appendSQL(`,`);
        }
        const sortFields = Object.entries(entry);
        if (sortFields.length !== 1) {
          throw new InvalidFindOptionsError(
            entityName, 
            `Invalid sort ${MealzError.quote(sortFields.join(', '))}`
          );
        }
        const [field, order] = sortFields[0];
        statement.appendSQL(` ${field} ${order === 'asc' ? 'ASC' : 'DESC'}`);
      });
    }

    // limit
    const { limit, offset } = options;
    if (limit <= 0) {
      throw new InvalidFindOptionsError(
        entityName, 
        `Invalid limit ${MealzError.quote(limit.toString())}`
      );
    }
    if (limit) {
      statement.appendSQL(` LIMIT ${limit}`);
    }

    // offset
    if (offset < 0) {
      throw new InvalidFindOptionsError(
        entityName, 
        `Invalid offset ${MealzError.quote(offset.toString())}`
      );
    }
    if (offset) {
      statement.appendSQL(` OFFSET ${offset}`);
    }

    return statement;
  }

  private buildFieldUpdate<T>(
    entityName: string,
    field: string,
    fieldsSpec: DBFieldSpec[],
    operator: UpdateOperator<T>,
    context: SQLiteStatementContext,
  ): SQLiteStatement {
    const keys = Object.keys(operator); 
    if (keys.length !== 1) {
      const operatorStr = JSON.stringify(operator);
      throw new SQLiteWhereBuildError(
        entityName,
        `Invalid update operator ${MealzError.quote(operatorStr)}`,
      );
    }
    const key = keys[0];
    const value = operator[key];
    const param = context.nextParam('set');

    switch (key) {
      case '$set':
        return new SQLiteStatement(
          `${field} = ${param}`,
          [this.getSQLValue(entityName, value)],
        );
      case '$inc':
        this.assertNumber(entityName, fieldsSpec, field);
        return new SQLiteStatement(
          `${field} = ${field} + ${param}`,
          [value],
        );
      default:
        throw new SQLiteWhereBuildError(
          entityName,
          `Invalid update operator ${MealzError.quote(key)}`,
        );
    }
  }

  public buildUpdate<T>(
    tableName: string,
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    update: Update<T>,
    where: Where<T>,
  ): SQLiteStatement {
    const context = new SQLiteStatementContext();
    let statement: SQLiteStatement = new SQLiteStatement(
      `UPDATE ${tableName} SET `,
    );

    Object.entries(update).forEach(([field, updateOperator], index) => {
      if (index > 0) {
        statement.appendSQL(`, `);
      }
      const fieldUpdateStatement = this.buildFieldUpdate(
        entityName,
        field,
        fieldsSpec,
        updateOperator,
        context,
      );
      statement.append(fieldUpdateStatement);
    });

    const whereStatement = this.buildWhere(
      entityName,
      where,
      fieldsSpec,
      context,
    );
    if (whereStatement.hasSQL()) {
      statement.appendSQL(` WHERE `);
      statement.append(whereStatement);
    }

    return statement;    
  }

  public buildInsert<T>(
    tableName: string,
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    entity: T,
    options?: {
      upsert?: boolean;
    },
  ): SQLiteStatement {
    const isDefined = (value: any) => value != null;
    const { upsert = false } = options ?? {};

    const context = new SQLiteStatementContext();
    let statement: SQLiteStatement = new SQLiteStatement(
      `INSERT${upsert ? ' OR REPLACE' : ''} INTO ${tableName} `,
    );

    const values: Array<{
      columnName: string;
      paramName: string;
      value: SQLiteParamValue,
    }> = [];

    // collect columns, parameters and values
    fieldsSpec.forEach(fieldSpec => {
      const value = entity[fieldSpec.name];
      
      // non-optional fields must have a value
      if (!fieldSpec.optional && !isDefined(value)) {
        throw new MissingRequiredDBFieldError(
          entityName,
          fieldSpec.name,
        );
      }

      // skip undefined values
      if (!isDefined(value)) {
        return;
      }

      values.push({
        columnName: fieldSpec.name,
        paramName: context.nextParam('value'),
        value: this.getSQLValue(entityName, value),
      });
    });    
    
    // columns
    const columns = values.map(item => item.columnName).join(',');
    statement.appendSQL(`(${columns}) VALUES (`);

    // values as parameters
    values.forEach((item, index) => {
      if (index > 0) {
        statement.appendSQL(`,`);
      }
      statement.appendSQL(`${item.paramName}`);
    });
    statement.appendSQL(`)`);

    // parameters
    values.forEach(item => {
      statement.addParam(item.value);
    });

    return statement;
  }

  public buildDelete<T>(
    tableName: string,
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    where: Where<T>,
  ): SQLiteStatement {
    const context = new SQLiteStatementContext();
    let statement: SQLiteStatement = new SQLiteStatement(
      `DELETE FROM ${tableName} `,
    );

    const whereStatement = this.buildWhere(
      entityName,
      where,
      fieldsSpec,
      context,
    );
    if (whereStatement.hasSQL()) {
      statement.appendSQL(` WHERE `);
      statement.append(whereStatement);
    }

    return statement;
  }
}