import { SQLiteDBModuleFeature } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { TELEGRAM_USERS_DB_NAME } from '../const';
import {
  TELEGRAM_TOKEN_DB_ENTITY_NAME,
  TELEGRAM_TOKEN_DB_TABLE_NAME,
  TELEGRAM_USER_DB_ENTITY_NAME,
  TELEGRAM_USER_DB_TABLE_NAME,
} from '../entities';

export const TELEGRAM_USERS_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: TELEGRAM_USERS_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_TELEGRAM_USERS_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: TELEGRAM_USER_DB_ENTITY_NAME,
      tableName: TELEGRAM_USER_DB_TABLE_NAME,
    },
    {
      entityName: TELEGRAM_TOKEN_DB_ENTITY_NAME,
      tableName: TELEGRAM_TOKEN_DB_TABLE_NAME,
    },
  ],
};