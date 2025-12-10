import { Module } from '@nestjs/common';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

import { getTelegramBotCommandProviders } from './commands';
import { TelegramBotClient } from './services';

@Module({
  imports: [
    TelegramUsersAPIModule.forRoot({}),
  ],
  providers: [
    TelegramBotClient,
    ...getTelegramBotCommandProviders(),
  ]
})
export class TelegramBotModule {}