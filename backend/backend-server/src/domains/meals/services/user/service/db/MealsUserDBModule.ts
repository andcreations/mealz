import { Module } from '@nestjs/common';
import { UserMealDBMapper } from './mapping';

@Module({
  providers: [UserMealDBMapper],
  exports: [UserMealDBMapper],
})
export class MealsUserDBModule {
}