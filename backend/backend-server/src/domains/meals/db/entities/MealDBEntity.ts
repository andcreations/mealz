import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const MEAL_DB_ENTITY_NAME = 'meal';
export const MEAL_DB_TABLE_NAME = 'meals';

@DBEntity(MEAL_DB_ENTITY_NAME)
export class MealDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'details_version',
    type: DBFieldType.INTEGER,
  })
  public details_version: number;

  @DBField({
    name: 'details',
    type: DBFieldType.BINARY,
  })
  public details: Buffer;  
}