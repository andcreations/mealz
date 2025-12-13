import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const USER_DB_ENTITY_NAME = 'user';
export const USER_DB_TABLE_NAME = 'users';

@DBEntity(USER_DB_ENTITY_NAME)
export class UserDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'first_name',
    type: DBFieldType.STRING,
  })
  public first_name: string;

  @DBField({
    name: 'last_name',
    type: DBFieldType.STRING,
  })
  public last_name: string;

  @DBField({
    name: 'email',
    type: DBFieldType.STRING,
  })
  public email: string;

  @DBField({
    name: 'password',
    type: DBFieldType.STRING,
  })
  public password?: string;

  @DBField({
    name: 'roles',
    type: DBFieldType.STRING,
  })
  public roles?: string; 
}