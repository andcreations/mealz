import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const USER_PROPERTIES_DB_ENTITY_NAME = 'user_properties';
export const USER_PROPERTIES_DB_TABLE_NAME = 'user_properties';

@DBEntity(USER_PROPERTIES_DB_ENTITY_NAME)
export class UserPropertiesDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'user_id',
    type: DBFieldType.STRING,
  })
  public user_id: string;

  @DBField({
    name: 'property_id',
    type: DBFieldType.STRING,
  })
  public property_id: string;

  @DBField({
    name: 'data',
    type: DBFieldType.STRING,
  })
  public data: string;

  @DBField({
    name: 'modified_at',
    type: DBFieldType.INTEGER,
  })
  public modified_at: number;
}
