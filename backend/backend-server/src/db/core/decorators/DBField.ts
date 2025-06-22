import { addDBFieldSpec } from '../spec';
import { DBEntityClass, DBFieldType } from '../types';

export interface DBFieldMapping<TDatabase, TEntity> {
  // Maps the value of an entity field to a database field value
  mapToDB: (value: TEntity) => TDatabase;

  // Maps the value of a database field to an entity field value
  mapToEntity: (value: TDatabase) => TEntity;
}

export interface DBFieldOptions {
  name: string;
  type: DBFieldType;
  primaryKey?: boolean;
  optional?: boolean;
  mapping?: DBFieldMapping<unknown, unknown>;
}

export const DBField = (
  options: DBFieldOptions,
): PropertyDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
  ): void => {
    if (typeof propertyKey !== 'string') {
      return;
    }

    addDBFieldSpec({
      clazz: target.constructor as DBEntityClass,
      ...options,
    });
  }
}