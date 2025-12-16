import { Module } from '@nestjs/common';
import { NamedMealDBMapper } from './mapping';

@Module({
  providers: [NamedMealDBMapper],
  exports: [NamedMealDBMapper],
})
export class MealsNamedDBModule {}