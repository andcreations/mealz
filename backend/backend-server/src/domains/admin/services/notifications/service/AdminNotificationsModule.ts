import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { TelegramBotAPIModule } from '@mealz/backend-telegram-bot-service-api';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

import {
  TelegramAdminNotificationsService,
  AdminNotificationsService,
} from './services';
import { AdminNotificationsRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    TelegramUsersAPIModule.forRoot({}),
    TelegramBotAPIModule.forRoot({}),
  ],
  providers: [
    TelegramAdminNotificationsService,
    AdminNotificationsService,
    AdminNotificationsRequestController,
  ],
})
export class AdminNotificationsModule {}