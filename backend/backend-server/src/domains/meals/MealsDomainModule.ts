import { Module } from '@nestjs/common';

import { MealsCrudModule } from './services/crud';
import { MealsUserModule, MealsUserGWModule } from './services/user';
import { MealsLogModule, MealsLogGWModule } from './services/log';
import { MealsDailyPlanModule } from './services/daily-plan/service';
import { MealsDailyPlanGWModule } from './services/daily-plan/gateway';

@Module({
  imports: [
    MealsCrudModule,
    MealsUserModule,
    MealsUserGWModule,
    MealsLogModule,
    MealsLogGWModule,
    MealsDailyPlanModule,
    MealsDailyPlanGWModule,
  ],
})
export class MealsDomainModule {
}