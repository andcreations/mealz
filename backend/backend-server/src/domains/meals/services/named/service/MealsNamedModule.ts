import { SQLiteDBModule } from '@mealz/backend-db';
import { Module } from '@nestjs/common';
import { IdGeneratorProvider, SagaModule } from '@mealz/backend-common';
import { LoggerModule } from '@mealz/backend-logger';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import { UsersCrudAPIModule } from '@mealz/backend-users-crud-service-api';
import {
  UsersNotificationsAPIModule,
} from '@mealz/backend-users-notifications-service-api';
import {
  ActionsManagerAPIModule,
} from '@mealz/backend-actions-manager-service-api';

import { MEALS_NAMED_SQLITE_DB_MODULE_OPTIONS, MealsNamedDBModule } from './db';
import { 
  MealsNamedCrudService,
  MealsNamedShareService,
  MealsNamedShareUsersService,
} from './services';
import { MealsNamedCrudRepository } from './repositories';
import { MealsDailyPlanRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SagaModule,
    MealsCrudAPIModule.forRoot({}),
    UsersCrudAPIModule.forRoot({}),
    UsersNotificationsAPIModule.forRoot({}),
    ActionsManagerAPIModule.forRoot({}),
    SQLiteDBModule.forFeature(MEALS_NAMED_SQLITE_DB_MODULE_OPTIONS),
    MealsNamedDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    MealsNamedCrudRepository,
    MealsNamedCrudService,
    MealsNamedShareService,
    MealsNamedShareUsersService,
    MealsDailyPlanRequestController,
  ],
})
export class MealsNamedModule {}