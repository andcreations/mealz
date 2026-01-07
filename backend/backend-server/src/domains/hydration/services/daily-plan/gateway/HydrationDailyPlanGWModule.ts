import { Module } from '@nestjs/common';
import {
  HydrationDailyPlanAPIModule,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { GWHydrationDailyPlanMapper, HydrationDailyPlanGWService } from './services';
import { HydrationDailyPlanGWController } from './controllers';

@Module({
  imports: [HydrationDailyPlanAPIModule.forRoot({})],
  providers: [GWHydrationDailyPlanMapper, HydrationDailyPlanGWService],
  controllers: [HydrationDailyPlanGWController],
})
export class HydrationDailyPlanGWModule {}