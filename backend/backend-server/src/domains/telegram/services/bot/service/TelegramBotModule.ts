import { Module } from '@nestjs/common';
import { SQLiteDBModule } from '@mealz/backend-db';
import { LoggerModule } from '@mealz/backend-logger';
import { IdGeneratorProvider } from '@mealz/backend-common';
import { UsersCrudAPIModule } from '@mealz/backend-users-crud-service-api';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';
import {
  HydrationLogAPIModule,
} from '@mealz/backend-hydration-log-service-api';

import {
  TELEGRAM_BOT_SQLITE_DB_MODULE_OPTIONS,
  TelegramBotDBModule,
} from './db';
import { getTelegramBotCommandProviders } from './commands';
import {
  TelegramBotClient,
  TelegramBotCommandProvider,
  TelegramBotService,
  TelegramBotUpdateService,
} from './services';
import { TelegramBotRequestController } from './controllers';
import { OutgoingTelegramMessagesRepository } from './repositories';

@Module({
  imports: [
    LoggerModule,
    UsersCrudAPIModule.forRoot({}),
    TelegramUsersAPIModule.forRoot({}),
    HydrationLogAPIModule.forRoot({}),
    SQLiteDBModule.forFeature(TELEGRAM_BOT_SQLITE_DB_MODULE_OPTIONS),
    TelegramBotDBModule,
  ],
  providers: [
    IdGeneratorProvider,
    OutgoingTelegramMessagesRepository,
    TelegramBotClient,
    TelegramBotService,
    TelegramBotCommandProvider,
    TelegramBotUpdateService,
    ...getTelegramBotCommandProviders(),
    TelegramBotRequestController,
  ]
})
export class TelegramBotModule {}