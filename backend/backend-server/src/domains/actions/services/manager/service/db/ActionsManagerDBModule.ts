import { Module } from '@nestjs/common';
import { ActionDBMapper } from './mapping';

@Module({
  providers: [
    ActionDBMapper,
  ],
  exports: [
    ActionDBMapper,
  ],
})
export class ActionsManagerDBModule {}