import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { SQLiteDBModule } from '@mealz/backend-db';
import {
  INGREDIENTS_SQLITE_DB_MODULE_OPTIONS,
  IngredientsDBModule,
} from '@mealz/backend-ingredients-db';

import { IngredientsCrudRepository } from './repositories';
import { IngredientsCrudService } from './services';
import { IngredientsCrudRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SQLiteDBModule.forRoot(INGREDIENTS_SQLITE_DB_MODULE_OPTIONS),
    IngredientsDBModule,
  ],
  providers: [
    IngredientsCrudRepository,
    IngredientsCrudService,
    IngredientsCrudRequestController,
  ],
})
export class IngredientsCrudModule {
}