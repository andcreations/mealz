import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const MEAL_DB_ENTITY_NAME = 'Meal';
export const MEAL_DB_TABLE_NAME = 'Meals';

@DBEntity(MEAL_DB_ENTITY_NAME)
export class MealDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
  })
  public id: string;

  @DBField({
    name: 'detailsVersion',
    type: DBFieldType.INTEGER,
  })
  public detailsVersion: number;

  @DBField({
    name: 'details',
    type: DBFieldType.BINARY,
  })
  public details: Buffer;  
}