import { SQLiteDBModuleFeature } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { MEALS_DAILY_PLAN_DB_NAME } from '../const';
import {
  MEAL_DAILY_PLAN_DB_ENTITY_NAME,
  MEAL_DAILY_PLAN_DB_TABLE_NAME,
} from '../entities';

export const MEALS_DAILY_PLAN_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: MEALS_DAILY_PLAN_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_MEALS_DAILY_PLAN_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: MEAL_DAILY_PLAN_DB_ENTITY_NAME,
      tableName: MEAL_DAILY_PLAN_DB_TABLE_NAME,
    },
  ],
};