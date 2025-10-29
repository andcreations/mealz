import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { IdGeneratorProvider, SagaModule } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';
import { LocalRequestTransporter } from '@mealz/backend-transport';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';

import {
  MEALS_USER_SQLITE_DB_MODULE_OPTIONS,
  MealsUserDBModule,
} from './db';
import { MealsUserRepository } from './repositories';
import { MealsUserService } from './services';
import { MealsUserController } from './controllers';

@Module({
  imports: [
    MealsCrudAPIModule.forRoot({}),
    LoggerModule,
    SagaModule,
    SQLiteDBModule.forRoot(MEALS_USER_SQLITE_DB_MODULE_OPTIONS),
    MealsUserDBModule,    
  ],
  providers: [
    IdGeneratorProvider,
    MealsUserRepository,
    MealsUserService,
    MealsUserController,
  ],
  exports: [
    MealsUserService,
  ],
})
export class MealsUserModule {
}
