import { Module } from '@nestjs/common';

import { TelegramUsersGWModule, TelegramUsersModule } from './services/users';
import { TelegramBotModule, TelegramBotGWModule } from './services/bot';

@Module({
  imports: [
    TelegramUsersModule,
    TelegramUsersGWModule,
    TelegramBotModule,
    TelegramBotGWModule,
  ],
})
export class TelegramDomainModule {}