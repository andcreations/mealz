import { Module } from '@nestjs/common';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import { MealsNamedAPIModule } from '@mealz/backend-meals-named-service-api';
import { MealsGWCommonModule } from '@mealz/backend-meals-gateway-common';

import { GWNamedMealMapper, MealsNamedPlanGWService } from './services';
import { MealsNamedGWController } from './controllers';

@Module({
  imports: [
    MealsCrudAPIModule.forRoot({}),
    MealsNamedAPIModule.forRoot({}),
    MealsGWCommonModule,
  ],
  providers: [MealsNamedPlanGWService, GWNamedMealMapper],
  controllers: [MealsNamedGWController],
})
export class MealsNamedGWModule {}