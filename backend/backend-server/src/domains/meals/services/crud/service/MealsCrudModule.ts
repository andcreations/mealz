import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';
import {
  MEALS_SQLITE_DB_MODULE_OPTIONS,
  MealsDBModule,
} from './db';

import { MealsCrudRepository } from './repositories';
import { MealsCrudService } from './services';
import { MealsCrudRequestController } from './controllers';

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
    MealsCrudRequestController,
  ],
})
export class MealsCrudModule {

}