import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const MEAL_LOG_DB_ENTITY_NAME = 'MealLog';
export const MEAL_LOG_DB_TABLE_NAME = 'MealLogs';

@DBEntity(MEAL_LOG_DB_ENTITY_NAME)
export class MealLogDBEntity {
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
    name: 'dailyPlanMealName',
    type: DBFieldType.STRING,
    optional: true,
  })
  public dailyPlanMealName?: string;

  @DBField({
    name: 'loggedAt',
    type: DBFieldType.INTEGER,
  })
  public loggedAt: number;
}