import { SQLiteDBModuleFeature } from '@mealz/backend-db';
import { requireStrEnv } from '@mealz/backend-common';

import { INGREDIENTS_DB_NAME } from '../const';
import {
  INGREDIENT_DB_ENTITY_NAME,
  INGREDIENT_DB_TABLE_NAME,
} from '../entities';

export const INGREDIENTS_SQLITE_DB_MODULE_OPTIONS: SQLiteDBModuleFeature = {
  name: INGREDIENTS_DB_NAME,
  dbFilename: requireStrEnv('MEALZ_INGREDIENTS_SQLITE_DB_FILE'),
  entities: [
    {
      entityName: INGREDIENT_DB_ENTITY_NAME,
      tableName: INGREDIENT_DB_TABLE_NAME,
    },
  ],
};