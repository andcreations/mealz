import { Injectable } from '@nestjs/common';
import { MealzError } from '#mealz/backend-common';

import {
  DBFieldSpec,
  Parameter,
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
} from '../../core';
import { SQLITE_FALSE, SQLITE_TRUE } from '../const';
import { SQLiteWhereBuildError } from '../errors';

@Injectable()
export class SQLiteSQLBuilder {
  private buildMulti<T>(
    entityName: string,
    whereList: Where<T>[],
    fieldsSpec: DBFieldSpec[],
    operator: string,
  ): string {
    let sql = '(';

    whereList.forEach((subWhere, index) => {
      if (index > 0) {
        sql += ` ${operator} `;
      }
      sql += this.buildWhere<T>(entityName, subWhere, fieldsSpec);
    });

    sql += ')';
    return sql;
  }

  private buildOr<T>(
    entityName: string,
    where: WhereOr<T>,
    fieldsSpec: DBFieldSpec[],
  ): string {
    return this.buildMulti(entityName, where[WHERE_OR], fieldsSpec, 'OR');
  }

  private buildAnd<T>(
    entityName: string,
    where: WhereAnd<T>,
    fieldsSpec: DBFieldSpec[],
  ): string {
    return this.buildMulti(entityName, where[WHERE_AND], fieldsSpec, 'AND');
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

  private getSQLValue(value: WhereOperator[keyof WhereOperator]): string {
    let sqlValue = '';
    const valueType = typeof value;
    switch (valueType) {
      case 'string':
        sqlValue = `'${value}'`;
        break;
      case 'number':
        sqlValue = value.toString();
        break;
      case 'boolean':
        sqlValue = value ? SQLITE_TRUE.toString() : SQLITE_FALSE.toString();
        break;
    }
    if (Array.isArray(value)) {
      sqlValue = value.map(this.getSQLValue).join(',');
    }
    if (value instanceof Parameter) {
      sqlValue = `@${value.getName()}`;
    }
    return sqlValue;    
  }

  private buildFieldWhere<T>(
    entityName: string,
    field: string,
    where: WhereOperator,
    fieldsSpec: DBFieldSpec[],
  ): string {
    let sql = '';

    Object.keys(where).forEach((operator, index) => {
      if (index > 0) {
        sql += ' AND ';
      }
      const sqlValue = this.getSQLValue(where[operator]);
  
      switch (operator) {
        case '$eq':
          sql += `${field} = ${sqlValue}`;
          break;
        case '$ne':
          sql += `${field} != ${sqlValue}`;
          break;
        case '$gt':
          this.assertNumber(entityName, fieldsSpec, field);
          sql += `${field} > ${sqlValue}`;
          break;
        case '$gte':
          this.assertNumber(entityName, fieldsSpec, field);
          sql += `${field} >= ${sqlValue}`;
          break;
        case '$lt':
          this.assertNumber(entityName, fieldsSpec, field);
          sql += `${field} < ${sqlValue}`;
          break;
        case '$lte':
          this.assertNumber(entityName, fieldsSpec, field);
          sql += `${field} <= ${sqlValue}`;
          break;
        case '$in':
          sql += `${field} IN (${sqlValue})`;
          break;
        case '$nin':
          sql += `${field} NOT IN (${sqlValue})`;
          break;
        case '$like':
          this.assertString(entityName, fieldsSpec, field);
          sql += `${field} LIKE ${sqlValue}`;
          break;
        default:
          throw new SQLiteWhereBuildError(
            entityName,
            `Unknown operator ${operator}`,
          );
      }
    });

    return sql;
  }

  public buildWhere<T>(
    entityName: string,
    where: Where<T>,
    fieldsSpec: DBFieldSpec[],
  ): string {
    const keys = Object.keys(where);
    if (keys.length === 0) {
      return '';
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
      return this.buildOr(entityName, where as WhereOr<T>, fieldsSpec);
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
      return this.buildAnd(entityName, where as WhereAnd<T>, fieldsSpec);
    }
   
    // field conditions
    let sql = '';
    Object.keys(where).forEach((field, index) => {
      if (index > 0) {
        sql += ' AND ';
      }
      sql += this.buildFieldWhere(entityName,field, where[field], fieldsSpec);
    });

    return sql;
  }

  public buildSelect<T>(
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    where?: Where<T>,
    options?: FindOptions<T, keyof T>,
  ): string {
    let sql = `SELECT`;

    // projection
    const { projection } = options;
    if (projection) {
      sql += ` ${projection.join(',')}`;
    } else {
      sql += ` *`;
    }

    // where
    sql += ` FROM ${entityName}`;
    const sqlWhere = this.buildWhere(entityName, where, fieldsSpec);
    if (sqlWhere) {
      sql += ` WHERE ${sqlWhere}`;
    }

    // sort
    const { sort } = options;
    if (sort && sort.length > 0) {
      sql += ` ORDER BY`;
      sort.forEach((entry, index) => {
        if (index > 0) {
          sql += `,`;
        }
        const sortFields = Object.entries(entry);
        if (sortFields.length !== 1) {
          throw new InvalidFindOptionsError(
            entityName, 
            `Invalid sort ${MealzError.quote(sortFields.join(', '))}`
          );
        }
        const [field, order] = sortFields[0];
        sql += ` ${field} ${order === 'asc' ? 'ASC' : 'DESC'}`;
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
      sql += ` LIMIT ${limit}`;
    }

    // offset
    if (offset < 0) {
      throw new InvalidFindOptionsError(
        entityName, 
        `Invalid offset ${MealzError.quote(offset.toString())}`
      );
    }
    if (offset) {
      sql += ` OFFSET ${offset}`;
    }

    return sql;
  }

  private buildFieldUpdate<T>(
    entityName: string,
    field: string,
    fieldsSpec: DBFieldSpec[],
    operator: UpdateOperator<T>,
  ): string {
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

    switch (key) {
      case '$set':
        return `${field} = ${this.getSQLValue(value)}`;
      case '$inc':
        this.assertNumber(entityName, fieldsSpec, field);
        return `${field} = ${field} + ${value}`;
      default:
        throw new SQLiteWhereBuildError(
          entityName,
          `Invalid update operator ${MealzError.quote(key)}`,
        );
    }
  }

  public buildUpdateSet<T>(
    entityName: string,
    fieldsSpec: DBFieldSpec[],
    update: Update<T>,
  ): string {
    let sql = ``;

    Object.entries(update).forEach(([field, updateOperator], index) => {
      if (index > 0) {
        sql += `,`;
      }
      sql += this.buildFieldUpdate(
        entityName,
        field,
        fieldsSpec,
        updateOperator,
      );
    });

    return sql;
  }
}