import { SQLiteDBModuleFeatureOptions } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { MEALS_USER_DB_NAME } from '../const';
import {
  USER_MEAL_DB_ENTITY_NAME,
  USER_MEAL_DB_TABLE_NAME,
} from '../entities';

export const MEALS_USER_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeatureOptions = {
  name: MEALS_USER_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_MEALS_USER_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: USER_MEAL_DB_ENTITY_NAME,
      tableName: USER_MEAL_DB_TABLE_NAME,
    },
  ],
};