import { Module } from '@nestjs/common';
import { TelegramTokenDBMapper, TelegramUserDBMapper } from './mapping';

@Module({
  providers: [
    TelegramUserDBMapper,
    TelegramTokenDBMapper,
  ],
  exports: [
    TelegramUserDBMapper,
    TelegramTokenDBMapper,
  ],
})
export class TelegramUsersDBModule {
}