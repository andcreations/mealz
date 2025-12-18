import { SQLiteDBModuleFeatureOptions } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { MEALS_NAMED_DB_NAME } from '../const';
import {
  MEALS_NAMED_DB_ENTITY_NAME,
  MEALS_NAMED_DB_TABLE_NAME,
} from '../entities';

export const MEALS_NAMED_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeatureOptions = {
  name: MEALS_NAMED_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_MEALS_NAMED_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: MEALS_NAMED_DB_ENTITY_NAME,
      tableName: MEALS_NAMED_DB_TABLE_NAME,
    },
  ],
};