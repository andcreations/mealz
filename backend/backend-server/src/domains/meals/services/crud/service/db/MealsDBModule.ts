import { Module } from '@nestjs/common';
import { MealDBMapper, MealDetailsV1Mapper } from './mapping';

@Module({
  providers: [
    MealDetailsV1Mapper,
    MealDBMapper,
  ],
  exports: [
    MealDBMapper,
  ],
})
export class MealsDBModule {}