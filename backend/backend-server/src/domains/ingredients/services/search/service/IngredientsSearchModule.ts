import { Module } from '@nestjs/common';
import { LoggerModule } from '#mealz/backend-logger';
import { SQLiteDBModule } from '#mealz/backend-db';
import {
  INGREDIENTS_SQLITE_DB_MODULE_OPTIONS,
  IngredientsDBModule,
} from '#mealz/backend-ingredients-db';

import { IngredientsSearchRepository } from './repositories';
import { IngredientsSearchService, SearchIndexFactory } from './services';

@Module({
  imports: [
    LoggerModule,
    SQLiteDBModule.forRoot(INGREDIENTS_SQLITE_DB_MODULE_OPTIONS),
    IngredientsDBModule,
  ],
  providers: [
    SearchIndexFactory,
    IngredientsSearchRepository,
    IngredientsSearchService,
  ],
})
export class IngredientsSearchModule {
}