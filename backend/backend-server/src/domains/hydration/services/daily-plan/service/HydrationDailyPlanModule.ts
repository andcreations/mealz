import { Module } from '@nestjs/common';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { SQLiteDBModule } from '@mealz/backend-db';

import { 
  HYDRATION_DAILY_PLAN_SQLITE_DB_MODULE_OPTIONS, 
  HydrationDailyPlanDBModule,
} from './db';
import { HydrationDailyPlanCrudRepository } from './repositories';
import { HydrationDailyPlanCrudService } from './services';
import { HydrationDailyPlanRequestController } from './controllers';

@Module({
  imports: [
    SQLiteDBModule.forFeature(HYDRATION_DAILY_PLAN_SQLITE_DB_MODULE_OPTIONS),
    HydrationDailyPlanDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    HydrationDailyPlanCrudService,
    HydrationDailyPlanCrudRepository,
    HydrationDailyPlanRequestController,
  ],
})
export class HydrationDailyPlanModule {}