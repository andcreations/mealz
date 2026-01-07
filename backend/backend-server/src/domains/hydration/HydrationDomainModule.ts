import { Module } from '@nestjs/common';

import { 
  HydrationDailyPlanModule,
  HydrationDailyPlanGWModule,
} from './services/daily-plan';

@Module({
  imports: [
    HydrationDailyPlanModule,
    HydrationDailyPlanGWModule,
  ],
})
export class HydrationDomainModule {}