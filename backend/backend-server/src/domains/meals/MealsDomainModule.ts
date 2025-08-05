import { Module } from '@nestjs/common';
import { MealsCrudModule } from './services/crud';
import { MealsUserModule } from './services/user';

@Module({
  imports: [
    MealsCrudModule,
    MealsUserModule,
  ],
})
export class MealsDomainModule {
}