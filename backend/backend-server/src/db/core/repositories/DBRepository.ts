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
   * @param entitySpec - The specification of the entity.
   * @param fieldsSpec - The specification of the fields of the entity.
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
   * @param entity - The entity to insert.
   * @param context - The context of the insert operation.
   */
  public abstract insert(entity: T, context: Context): Promise<void>;

  /**
   * Upsert an entity into the database.
   * @param entity - The entity to upsert.
   * @param context - The context of the upsert operation.
   */
  public abstract upsert(entity: T, context: Context): Promise<void>;

  /**
   * Find entities in the database.
   * @param where - The where clause.
   * @param options - The options of the find operation.
   * @param context - The context of the find operation.
   * @returns The entities found.
   */
  public abstract find<K extends keyof T>(
    where: Where<T>,
    options: FindOptions<T, K>,
    context: Context,
  ): Promise<Pick<T, K>[]>;
    
  /**
   * Find one entity in the database.
   * @param where - The where clause.
   * @param options - The options of the find operation.
   * @returns The entity found.
   */  
  public async findOne<K extends keyof T>(
    where: Where<T>,
    options: Omit<FindOptions<T, K>, 'limit'>,
    context: Context,
  ): Promise<Pick<T, K> | undefined> {
    const entities = await this.find(
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
   * Iterate over the entities in the database.
   * @param where - The where clause.
   * @param options - The options of the iterate operation.
   * @param callback - The callback to be called for each entity.
   * @param context - The context of the iterate operation.
   */
  public abstract iterate<K extends keyof T>(
    where: Where<T>,
    options: Omit<FindOptions<T, K>, 'limit'>,
    callback: IterateCallback<T>,
    context: Context,
  ): Promise<void>;

  /**
   * Update entities in the database.
   * @param where - The where clause.
   * @param update - The update operator.
   * @param context - The context of the update operation.
   */
  public abstract update(
    where: Where<T>,
    update: Update<T>,
    context: Context,
  ): Promise<void>;

  /**
   * Delete entities from the database.
   * @param where - The where clause.
   * @param context - The context of the delete operation.
   */
  public abstract delete(
    where: Where<T>,
    context: Context,
  ): Promise<void>;
}
