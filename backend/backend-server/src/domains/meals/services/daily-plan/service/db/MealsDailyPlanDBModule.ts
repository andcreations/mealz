import { Module } from '@nestjs/common';
import { MealDailyPlanDBMapper, MealDailyPlanDetailsV1Mapper } from './mapping';

@Module({
  providers: [
    MealDailyPlanDetailsV1Mapper,
    MealDailyPlanDBMapper,
  ],
  exports: [
    MealDailyPlanDBMapper,
  ],
})
export class MealsDailyPlanDBModule {
}