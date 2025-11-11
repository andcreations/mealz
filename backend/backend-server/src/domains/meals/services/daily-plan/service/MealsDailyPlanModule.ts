import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';

import { 
  MEALS_DAILY_PLAN_SQLITE_DB_MODULE_OPTIONS, 
  MealsDailyPlanDBModule,
} from './db';
import { MealsDailyPlanCrudRepository } from './repositories';
import { MealsDailyPlanCrudService } from './services';
import { MealsDailyPlanRequestController } from './controllers';

@Module({
  imports: [
    SQLiteDBModule.forRoot(MEALS_DAILY_PLAN_SQLITE_DB_MODULE_OPTIONS),
    MealsDailyPlanDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    MealsDailyPlanCrudService,
    MealsDailyPlanCrudRepository,
    MealsDailyPlanRequestController,
  ],
})
export class MealsDailyPlanModule {
}