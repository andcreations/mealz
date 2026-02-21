import { requireStrEnv } from '@mealz/backend-common';
import { SQLiteDBModuleFeature } from '@mealz/backend-db';

import { USERS_PROPERTIES_DB_NAME } from '../const';
import {
  USER_PROPERTIES_DB_ENTITY_NAME,
  USER_PROPERTIES_DB_TABLE_NAME,
} from '../entities';

export const USERS_PROPERTIES_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: USERS_PROPERTIES_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_USERS_PROPERTIES_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: USER_PROPERTIES_DB_ENTITY_NAME,
      tableName: USER_PROPERTIES_DB_TABLE_NAME,
    },
  ],
};
