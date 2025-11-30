import { Module } from '@nestjs/common';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

import { TelegramUsersRequestService } from './services';
import { TelegramUsersRequestController } from './controllers';

@Module({
  imports: [
    TelegramUsersAPIModule.forRoot({}),
  ],
  providers: [
    TelegramUsersRequestService,
    TelegramUsersRequestController,
  ],
})
export class TelegramUsersModule {}