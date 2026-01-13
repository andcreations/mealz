import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { UsersCrudAPIModule } from '@mealz/backend-users-crud-service-api';
import { 
  UsersNotificationsAPIModule,
} from '@mealz/backend-users-notifications-service-api';
import {
  HydrationDailyPlanAPIModule,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { HydrationReminderService } from './services';
import { 
  HydrationLogAPIModule,
} from '@mealz/backend-hydration-log-service-api';

@Module({
  imports: [
    LoggerModule,
    UsersCrudAPIModule.forRoot({}),
    UsersNotificationsAPIModule.forRoot({}),
    HydrationDailyPlanAPIModule.forRoot({}),
    HydrationLogAPIModule.forRoot({}),
  ],
  providers: [
    HydrationReminderService,
  ],
  exports: [],
})
export class HydrationReminderModule {}