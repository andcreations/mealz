import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const USER_MEAL_DB_ENTITY_NAME = 'UserMeal';
export const USER_MEAL_DB_TABLE_NAME = 'UserMeals';

@DBEntity(USER_MEAL_DB_ENTITY_NAME)
export class UserMealDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'userId',
    type: DBFieldType.STRING,
  })
  public userId: string;

  @DBField({
    name: 'mealId',
    type: DBFieldType.STRING,
  })
  public mealId: string;

  @DBField({
    name: 'typeId',
    type: DBFieldType.STRING,
  })
  public typeId: string;

  @DBField({
    name: 'metadata',
    type: DBFieldType.BINARY,
    optional: true,
  })
  public metadata?: Buffer;
}