import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const USER_MEAL_DB_ENTITY_NAME = 'user_meal';
export const USER_MEAL_DB_TABLE_NAME = 'user_meals';

@DBEntity(USER_MEAL_DB_ENTITY_NAME)
export class UserMealDBEntity {
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
    name: 'meal_id',
    type: DBFieldType.STRING,
  })
  public meal_id: string;

  @DBField({
    name: 'type_id',
    type: DBFieldType.STRING,
  })
  public type_id: string;

  @DBField({
    name: 'metadata',
    type: DBFieldType.BINARY,
    optional: true,
  })
  public metadata?: Buffer;
}