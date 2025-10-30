import { Module } from '@nestjs/common';
import { MealLogDBMapper } from './mapping';

@Module({
  providers: [
    MealLogDBMapper,
  ],
  exports: [
    MealLogDBMapper,
  ],
})
export class MealsLogDBModule {
}