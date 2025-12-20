import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { 
  TelegramBotAPIModule,
} from '@mealz/backend-telegram-bot-service-api';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

import {
  TelegramUsersNotificationsService,
  UsersNotificationsService,
} from './services';
import { 
  UsersNotificationsRequestController,
 } from './controllers';

@Module({
  imports: [
    LoggerModule,
    TelegramUsersAPIModule.forRoot({}),
    TelegramBotAPIModule.forRoot({}),
  ],
  providers: [
    UsersNotificationsService,
    TelegramUsersNotificationsService,
    UsersNotificationsRequestController,
  ],
})
export class UsersNotificationsModule {}