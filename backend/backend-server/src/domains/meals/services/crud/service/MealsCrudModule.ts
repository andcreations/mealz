import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';
import {
  MEALS_SQLITE_DB_MODULE_OPTIONS,
  MealsDBModule,
} from '@mealz/backend-meals-db';

import { MealsCrudRepository } from './repositories';
import { MealsCrudService } from './services';
import { MealsCrudController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SQLiteDBModule.forRoot(MEALS_SQLITE_DB_MODULE_OPTIONS),
    MealsDBModule,    
  ],
  providers: [
    IdGeneratorProvider,
    MealsCrudRepository,
    MealsCrudService,
    MealsCrudController,
  ],
})
export class MealsCrudModule {

}