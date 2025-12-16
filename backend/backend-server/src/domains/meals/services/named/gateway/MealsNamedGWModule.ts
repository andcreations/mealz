import { Module } from '@nestjs/common';
import { MealsNamedAPIModule } from '@mealz/backend-meals-named-service-api';

import { GWNamedMealMapper, MealsNamedPlanGWService } from './services';
import { MealsNamedGWController } from './controllers';

@Module({
  imports: [MealsNamedAPIModule.forRoot({})],
  providers: [MealsNamedPlanGWService, GWNamedMealMapper],
  controllers: [MealsNamedGWController],
})
export class MealsNamedGWModule {}