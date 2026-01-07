import { Module } from '@nestjs/common';
import { HydrationDailyPlanDBMapper, HydrationDailyPlanDetailsV1Mapper } from './mapping';

@Module({
  providers: [
    HydrationDailyPlanDetailsV1Mapper,
    HydrationDailyPlanDBMapper,
  ],
  exports: [
    HydrationDailyPlanDBMapper,
  ],
})
export class HydrationDailyPlanDBModule {}