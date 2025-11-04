import { Module } from '@nestjs/common';
import { IdGeneratorProvider, SagaModule } from '@mealz/backend-common';
import { LoggerModule } from '@mealz/backend-logger';
import { SQLiteDBModule } from '@mealz/backend-db';
import { MealsCommonModule } from '@mealz/backend-meals-common';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';

import { MEALS_LOG_SQLITE_DB_MODULE_OPTIONS, MealsLogDBModule } from './db';
import {
  MealsLogCrudRepository,
  MealsLogHistoryRepository,
} from './repositories';
import { MealsLogCrudService, MealsLogHistoryService } from './services';
import { MealsLogRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SagaModule,
    MealsCommonModule,
    MealsLogDBModule,
    SQLiteDBModule.forRoot(MEALS_LOG_SQLITE_DB_MODULE_OPTIONS),
    MealsCrudAPIModule.forRoot({}),
  ],
  providers: [
    IdGeneratorProvider,
    MealsLogCrudRepository,
    MealsLogCrudService,
    MealsLogHistoryRepository,
    MealsLogHistoryService,
    MealsLogRequestController,
  ],
})
export class MealsLogModule {
}