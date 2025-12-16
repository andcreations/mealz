import { Module } from '@nestjs/common';

import { MealsCrudModule } from './services/crud';
import { MealsUserModule, MealsUserGWModule } from './services/user';
import { MealsLogModule, MealsLogGWModule } from './services/log';
import { MealsDailyPlanModule, MealsDailyPlanGWModule } from './services/daily-plan';
import { MealsNamedModule, MealsNamedGWModule } from './services/named';

@Module({
  imports: [
    MealsCrudModule,
    MealsUserModule,
    MealsUserGWModule,
    MealsLogModule,
    MealsLogGWModule,
    MealsDailyPlanModule,
    MealsDailyPlanGWModule,
    MealsNamedModule,
    MealsNamedGWModule,
  ],
})
export class MealsDomainModule {
}