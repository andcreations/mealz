import { Module } from '@nestjs/common';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

@Module({
  imports: [
    TelegramUsersAPIModule.forRoot({}),
  ],
})
export class TelegramBotModule {}