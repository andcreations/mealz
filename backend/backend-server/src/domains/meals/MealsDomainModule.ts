import { Module } from '@nestjs/common';
import { MealsCrudModule } from './services/crud';
import { MealsUserGWModule, MealsUserModule } from './services/user';

@Module({
  imports: [
    MealsCrudModule,
    MealsUserModule,
    MealsUserGWModule,
  ],
})
export class MealsDomainModule {
}