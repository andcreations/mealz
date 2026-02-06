import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { IdGeneratorProvider, SagaModule } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import {
  AdminNotificationsAPIModule,
} from '@mealz/backend-admin-notifications-service-api';

import {
  MEALS_USER_SQLITE_DB_MODULE_OPTIONS,
  MealsUserDBModule,
} from './db';
import { 
  MealsUserRepository,
  MealsUserRetentionRepository,
} from './repositories';
import { MealsUserRetention, MealsUserService } from './services';
import { MealsUserRequestController } from './controllers';

@Module({
  imports: [
    MealsCrudAPIModule.forRoot({}),
    AdminNotificationsAPIModule.forRoot({}),
    LoggerModule,
    SagaModule,
    SQLiteDBModule.forFeature(MEALS_USER_SQLITE_DB_MODULE_OPTIONS),
    MealsUserDBModule,    
  ],
  providers: [
    IdGeneratorProvider,
    MealsUserRepository,
    MealsUserService,
    MealsUserRetentionRepository,
    MealsUserRetention,
    MealsUserRequestController,
  ],
  exports: [
    MealsUserService,
  ],
})
export class MealsUserModule {
}
