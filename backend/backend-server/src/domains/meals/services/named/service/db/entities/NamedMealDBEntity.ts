import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const MEALS_NAMED_DB_ENTITY_NAME = 'named_meal';
export const MEALS_NAMED_DB_TABLE_NAME = 'named_meals';

@DBEntity(MEALS_NAMED_DB_ENTITY_NAME)
export class NamedMealDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'user_id',
    type: DBFieldType.STRING,
    optional: true,
  })
  public user_id?: string;

  @DBField({
    name: 'meal_name',
    type: DBFieldType.STRING,
  })
  public meal_name: string;

  @DBField({
    name: 'meal_id',
    type: DBFieldType.STRING,
  })
  public meal_id: string;
}