import { DBEntity, DBField, DBFieldType } from '#mealz/backend-db';

export const USER_DB_ENTITY_NAME = 'User';

@DBEntity(USER_DB_ENTITY_NAME)
export class UserDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

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