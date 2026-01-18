import { SQLiteDBModuleFeature } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { HYDRATION_LOG_DB_NAME } from '../const';
import {
  HYDRATION_LOG_DB_ENTITY_NAME,
  HYDRATION_LOG_DB_TABLE_NAME,
} from '../entities';

export const HYDRATION_LOG_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: HYDRATION_LOG_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_HYDRATION_LOG_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: HYDRATION_LOG_DB_ENTITY_NAME,
      tableName: HYDRATION_LOG_DB_TABLE_NAME,
    },
  ],
};