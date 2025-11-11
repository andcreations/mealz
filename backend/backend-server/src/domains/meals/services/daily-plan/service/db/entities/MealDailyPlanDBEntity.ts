import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const MEAL_DAILY_PLAN_DB_ENTITY_NAME = 'MealDailyPlan';
export const MEAL_DAILY_PLAN_DB_TABLE_NAME = 'MealDailyPlans';

@DBEntity(MEAL_DAILY_PLAN_DB_ENTITY_NAME)
export class MealDailyPlanDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
  })
  public id: string;

  @DBField({
    name: 'userId',
    type: DBFieldType.STRING,
  })
  public userId: string;

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

  @DBField({
    name: 'createdAt',
    type: DBFieldType.INTEGER,
  })
  public createdAt: number;
}