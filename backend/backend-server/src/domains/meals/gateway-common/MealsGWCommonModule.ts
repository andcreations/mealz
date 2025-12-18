import { Module } from '@nestjs/common';
import { GWMealMapper } from './services';

@Module({
  providers: [GWMealMapper],
  exports: [GWMealMapper],
})
export class MealsGWCommonModule {}