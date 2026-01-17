import { Context } from '@mealz/backend-core';

import { InvalidDBFieldTypeError } from '../errors';
import { DBEntitySpec, DBFieldSpec } from '../spec';
import { getDBEntityPrimaryKeyAsString } from '../utils';
import { FindOptions, IterateCallback, Update, Where } from '../types';

export abstract class DBRepository<T> {
  private entitySpec: DBEntitySpec;
  private fieldsSpec: DBFieldSpec[];

  protected getEntityName(): string {
    return this.entitySpec.name;
  }

  protected getEntitySpec(): DBEntitySpec {
    return this.entitySpec;
  }

  protected getFieldsSpec(): DBFieldSpec[] {
    return this.fieldsSpec;
  }

  protected primaryKeyAsString(entity: T): string {
    return getDBEntityPrimaryKeyAsString(this.fieldsSpec, entity);
  }

  /**
   * Initialize the repository.
   * @param entitySpec Specification of the entity.
   * @param fieldsSpec Specification of the fields of the entity.
   */
  public async init(
    entitySpec: DBEntitySpec,
    fieldsSpec: DBFieldSpec[],
  ): Promise<void> {
    this.entitySpec = entitySpec;
    this.fieldsSpec = fieldsSpec;

    // list & validate fields
    const existingFields = await this.listFields();
    await this.validateFields(entitySpec.name, existingFields, fieldsSpec);
  }

  private async validateFields(
    entityName: string,
    existingFields: Pick<DBFieldSpec, 'name' | 'type'>[],
    fieldsSpec: DBFieldSpec[],
  ): Promise<void> {
    fieldsSpec.forEach(fieldSpec => {
      const existingField = existingFields.find(itr => {
        return itr.name === fieldSpec.name;
      });
      if (!existingField) {
        return;
      }
      if (existingField.type !== fieldSpec.type) {
        throw new InvalidDBFieldTypeError(
          entityName,
          fieldSpec.name,
          fieldSpec.type,
          existingField.type,
        );
      }
    });
  }

  /**
   * List the fields of the entity.
   * @returns The fields of the entity.
   */
  public abstract listFields(): Promise<Pick<DBFieldSpec, 'name' | 'type'>[]>;

  /**
   * Insert an entity into the database.
   * @param opName Name of the operation (unique).
   * @param entity Entity to insert.
   * @param context Context of the insert operation.
   */
  public abstract insert(
    opName: string,
    entity: T,
    context: Context,
  ): Promise<void>;

  /**
   * Upsert an entity into the database.
   * @param opName Name of the operation (unique).
   * @param entity Entity to upsert.
   * @param context Context of the upsert operation.
   */
  public abstract upsert(
    opName: string,
    entity: T,
    context: Context,
  ): Promise<void>;

  /**
   * Find entities in the database.
   * @param opName Name of the operation (unique).
   * @param where Where clause.
   * @param options Options of the find operation.
   * @param context Context of the find operation.
   * @returns Found entities.
   */
  public abstract find<K extends keyof T>(
    opName: string,
    where: Where<T>,
    options: FindOptions<T, K>,
    context: Context,
  ): Promise<Pick<T, K>[]>;
    
  /**
   * Find one entity in the database.
   * @param opName Name of the operation (unique).
   * @param where Where clause.
   * @param options Options of the find operation.
   * @returns Found entity.
   */  
  public async findOne<K extends keyof T>(
    opName: string,
    where: Where<T>,
    options: Omit<FindOptions<T, K>, 'limit'>,
    context: Context,
  ): Promise<Pick<T, K> | undefined> {
    const entities = await this.find(
      opName,
      where,
      {
        ...options,
        limit: 1,
      },
      context,
    );
    return entities.length > 0 ? entities[0] : undefined;
  }

  /**
   * Update entities in the database.
   * @param opName Name of the operation (unique).
   * @param where Where clause.
   * @param update Update operator.
   * @param context Context of the update operation.
   */
  public abstract update(
    opName: string,
    where: Where<T>,
    update: Update<T>,
    context: Context,
  ): Promise<void>;

  /**
   * Delete entities from the database.
   * @param opName Name of the operation (unique).
   * @param where Where clause.
   * @param context Context of the delete operation.
   */
  public abstract delete(
    opName: string,
    where: Where<T>,
    context: Context,
  ): Promise<void>;

  /**
   * Runs a transactional operation.
   * @param func Function to be executed in the transaction.
   */
  public abstract transaction(func: () => Promise<void>): Promise<void>;
}
