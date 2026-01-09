import { Module } from '@nestjs/common';

import { 
  HydrationDailyPlanModule,
  HydrationDailyPlanGWModule,
} from './services/daily-plan';
import { 
  HydrationLogModule,
  HydrationLogGWModule,
} from './services/log';

@Module({
  imports: [
    HydrationDailyPlanModule,
    HydrationDailyPlanGWModule,
    HydrationLogModule,
    HydrationLogGWModule,
  ],
})
export class HydrationDomainModule {}