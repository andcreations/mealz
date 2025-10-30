import { Module } from '@nestjs/common';

import { MealsCrudModule } from './services/crud';
import { MealsUserModule, MealsUserGWModule } from './services/user';
import { MealsLogModule, MealsLogGWModule } from './services/log';

@Module({
  imports: [
    MealsCrudModule,
    MealsUserModule,
    MealsUserGWModule,
    MealsLogModule,
    MealsLogGWModule,
  ],
})
export class MealsDomainModule {
}