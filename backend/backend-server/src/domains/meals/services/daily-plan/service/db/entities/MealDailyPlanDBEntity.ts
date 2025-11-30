import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const MEAL_DAILY_PLAN_DB_ENTITY_NAME = 'meal_daily_plan';
export const MEAL_DAILY_PLAN_DB_TABLE_NAME = 'meal_daily_plans';

@DBEntity(MEAL_DAILY_PLAN_DB_ENTITY_NAME)
export class MealDailyPlanDBEntity {
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
    name: 'details_version',
    type: DBFieldType.INTEGER,
  })
  public details_version: number;

  @DBField({
    name: 'details',
    type: DBFieldType.BINARY,
  })
  public details: Buffer;

  @DBField({
    name: 'createdAt',
    type: DBFieldType.INTEGER,
  })
  public createdAt: number;
}