import { Module } from '@nestjs/common';
import { TelegramUserDBMapper } from './mapping';

@Module({
  providers: [TelegramUserDBMapper],
  exports: [TelegramUserDBMapper],
})
export class TelegramUsersDBModule {
}