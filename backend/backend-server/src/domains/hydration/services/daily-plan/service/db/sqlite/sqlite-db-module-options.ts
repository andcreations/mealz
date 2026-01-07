import { SQLiteDBModuleFeature } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { HYDRATION_DAILY_PLAN_DB_NAME } from '../const';
import {
  HYDRATION_DAILY_PLAN_DB_ENTITY_NAME,
  HYDRATION_DAILY_PLAN_DB_TABLE_NAME,
} from '../entities';

export const HYDRATION_DAILY_PLAN_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: HYDRATION_DAILY_PLAN_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_HYDRATION_DAILY_PLAN_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: HYDRATION_DAILY_PLAN_DB_ENTITY_NAME,
      tableName: HYDRATION_DAILY_PLAN_DB_TABLE_NAME,
    },
  ],
};