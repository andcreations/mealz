import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const MEAL_LOG_DB_ENTITY_NAME = 'meal_log';
export const MEAL_LOG_DB_TABLE_NAME = 'meal_logs';

@DBEntity(MEAL_LOG_DB_ENTITY_NAME)
export class MealLogDBEntity {
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
    name: 'daily_plan_meal_name',
    type: DBFieldType.STRING,
    optional: true,
  })
  public daily_plan_meal_name?: string;

  @DBField({
    name: 'logged_at',
    type: DBFieldType.INTEGER,
  })
  public logged_at: number;
}