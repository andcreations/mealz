import { SQLiteDBModuleOptions } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { MEALS_DB_NAME } from '../const';
import { MEAL_DB_ENTITY_NAME, MEAL_DB_TABLE_NAME } from '../entities';

export const MEALS_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleOptions = {
  name: MEALS_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_MEALS_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: MEAL_DB_ENTITY_NAME,
      tableName: MEAL_DB_TABLE_NAME,
    },
  ],
};