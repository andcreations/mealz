import { SQLiteDBModuleOptions } from '#mealz/backend-db';
import { requireStrEnv } from '#mealz/backend-common';

import { USERS_DB_NAME } from '../const';
import { USER_DB_ENTITY_NAME, USER_DB_TABLE_NAME } from '../entities';

export const USERS_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleOptions = {
  name: USERS_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_USERS_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: USER_DB_ENTITY_NAME,
      tableName: USER_DB_TABLE_NAME,
    },
  ],
};