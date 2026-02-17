import { Module } from '@nestjs/common';

import { OutgoingTelegramMessageDBMapper } from './mapping';

@Module({
  providers: [
    OutgoingTelegramMessageDBMapper,
  ],
  exports: [
    OutgoingTelegramMessageDBMapper,
  ],
})
export class TelegramBotDBModule {}
