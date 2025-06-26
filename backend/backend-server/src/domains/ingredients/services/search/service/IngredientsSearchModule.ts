import { Module } from '@nestjs/common';
import { SQLiteDBModule } from '#mealz/backend-db';
import {
  IngredientDBMapper,
  INGREDIENTS_SQLITE_DB_MODULE_OPTIONS,
} from '#mealz/backend-ingredients-db';

import { IngredientsSearchRepository } from './repositories';

@Module({
  imports: [
    SQLiteDBModule.forRoot(INGREDIENTS_SQLITE_DB_MODULE_OPTIONS),
  ],
  providers: [
    IngredientDBMapper,
    IngredientsSearchRepository,
  ],
  controllers: [],
})
export class IngredientsSearchModule {}