import { Module } from '@nestjs/common';
import { IdGeneratorProvider, SagaModule } from '@mealz/backend-common';
import { LoggerModule } from '@mealz/backend-logger';
import { SQLiteDBModule } from '@mealz/backend-db';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';

import { MEALS_LOG_SQLITE_DB_MODULE_OPTIONS, MealsLogDBModule } from './db';
import { MealsLogRepository } from './repositories';
import { MealsLogService } from './services';
import { MealsLogRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SagaModule,
    MealsLogDBModule,
    SQLiteDBModule.forRoot(MEALS_LOG_SQLITE_DB_MODULE_OPTIONS),
    MealsCrudAPIModule.forRoot({}),
  ],
  providers: [
    IdGeneratorProvider,
    MealsLogRepository,
    MealsLogService,
    MealsLogRequestController,
  ],
})
export class MealsLogModule {
}