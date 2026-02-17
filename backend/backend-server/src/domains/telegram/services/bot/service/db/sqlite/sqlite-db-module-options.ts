import { requireStrEnv } from '@mealz/backend-common';
import { SQLiteDBModuleFeature } from '@mealz/backend-db';

import { TELEGRAM_BOT_DB_NAME } from '../const';
import {
  OUTGOING_TELEGRAM_MESSAGE_DB_ENTITY_NAME,
  OUTGOING_TELEGRAM_MESSAGE_DB_TABLE_NAME,
} from '../entities';

export const TELEGRAM_BOT_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: TELEGRAM_BOT_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_TELEGRAM_BOT_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: OUTGOING_TELEGRAM_MESSAGE_DB_ENTITY_NAME,
      tableName: OUTGOING_TELEGRAM_MESSAGE_DB_TABLE_NAME,
    },
  ],
};
