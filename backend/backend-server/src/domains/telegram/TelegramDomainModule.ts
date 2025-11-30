import { Module } from '@nestjs/common';

import { TelegramUsersModule } from './services/users';
import { TelegramBotModule } from './services/bot';

@Module({
  imports: [
    TelegramUsersModule,
    TelegramBotModule,
  ],
})
export class TelegramDomainModule {}