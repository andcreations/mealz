import { SQLiteDBModuleFeature } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { ACTIONS_MANAGER_DB_NAME } from '../const';
import {
  ACTION_DB_ENTITY_NAME,
  ACTION_DB_TABLE_NAME,
} from '../entities';

export const ACTIONS_MANAGER_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: ACTIONS_MANAGER_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_ACTIONS_MANAGER_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: ACTION_DB_ENTITY_NAME,
      tableName: ACTION_DB_TABLE_NAME,
    },
  ],
};