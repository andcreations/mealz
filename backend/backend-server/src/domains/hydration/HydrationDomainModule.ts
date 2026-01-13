import { Module } from '@nestjs/common';

import { 
  HydrationDailyPlanModule,
  HydrationDailyPlanGWModule,
} from './services/daily-plan';
import { 
  HydrationLogModule,
  HydrationLogGWModule,
} from './services/log';
import { HydrationReminderModule } from './services/reminder';

@Module({
  imports: [
    HydrationDailyPlanModule,
    HydrationDailyPlanGWModule,
    HydrationLogModule,
    HydrationLogGWModule,
    HydrationReminderModule,
  ],
})
export class HydrationDomainModule {}