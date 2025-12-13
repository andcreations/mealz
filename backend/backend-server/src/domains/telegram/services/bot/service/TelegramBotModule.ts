import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { UsersCrudAPIModule } from '@mealz/backend-users-crud-service-api';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

import { getTelegramBotCommandProviders } from './commands';
import {
  TelegramBotClient,
  TelegramBotCommandProvider,
  TelegramBotService,
  TelegramBotUpdateService,
} from './services';
import { TelegramBotRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    UsersCrudAPIModule.forRoot({}),
    TelegramUsersAPIModule.forRoot({}),
  ],
  providers: [
    TelegramBotClient,
    TelegramBotService,
    TelegramBotCommandProvider,
    TelegramBotUpdateService,
    ...getTelegramBotCommandProviders(),
    TelegramBotRequestController,
  ]
})
export class TelegramBotModule {}