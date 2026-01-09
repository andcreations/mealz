import { Module } from '@nestjs/common';
import { HydrationLogDBMapper } from './mapping';

@Module({
  providers: [
    HydrationLogDBMapper,
  ],
  exports: [
    HydrationLogDBMapper,
  ],
})
export class HydrationLogDBModule {}