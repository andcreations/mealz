import { SQLiteDBModule } from '@mealz/backend-db';
import { Module } from '@nestjs/common';
import { IdGeneratorProvider, SagaModule } from '@mealz/backend-common';
import { LoggerModule } from '@mealz/backend-logger';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';

import { MEALS_NAMED_SQLITE_DB_MODULE_OPTIONS, MealsNamedDBModule } from './db';
import { MealsNamedCrudService } from './services';
import { MealsNamedCrudRepository } from './repositories';
import { MealsDailyPlanRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SagaModule,
    MealsCrudAPIModule.forRoot({}),
    SQLiteDBModule.forRoot(MEALS_NAMED_SQLITE_DB_MODULE_OPTIONS),
    MealsNamedDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    MealsNamedCrudRepository,
    MealsNamedCrudService,
    MealsDailyPlanRequestController,
  ],
})
export class MealsNamedModule {}