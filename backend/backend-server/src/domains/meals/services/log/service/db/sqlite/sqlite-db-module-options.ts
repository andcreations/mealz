import { SQLiteDBModuleOptions } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { MEALS_LOG_DB_NAME } from '../const';
import {
  MEAL_LOG_DB_ENTITY_NAME,
  MEAL_LOG_DB_TABLE_NAME,
} from '../entities';

export const MEALS_LOG_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleOptions = {
  name: MEALS_LOG_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_MEALS_LOG_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: MEAL_LOG_DB_ENTITY_NAME,
      tableName: MEAL_LOG_DB_TABLE_NAME,
    },
  ],
};