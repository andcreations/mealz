import { Module } from '@nestjs/common';
import { SQLiteDBModule } from '@mealz/backend-db';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

import { 
  TELEGRAM_USERS_SQLITE_DB_MODULE_OPTIONS,
  TelegramUsersDBModule,
} from './db';
import {
  TelegramTokensRepository,
  TelegramUsersRepository,
} from './repositories';
import {
  TelegramTokensService,
  TelegramUsersRequestService,
  TelegramUsersService,
} from './services';
import { TelegramUsersRequestController } from './controllers';

@Module({
  imports: [
    TelegramUsersAPIModule.forRoot({}),
    SQLiteDBModule.forRoot(TELEGRAM_USERS_SQLITE_DB_MODULE_OPTIONS),
    TelegramUsersDBModule,
  ],
  providers: [
    TelegramTokensRepository,
    TelegramTokensService,
    TelegramUsersRepository,
    TelegramUsersService,
    TelegramUsersRequestService,
    TelegramUsersRequestController,
  ],
})
export class TelegramUsersModule {}