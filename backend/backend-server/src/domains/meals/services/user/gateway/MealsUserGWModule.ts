import { Module } from '@nestjs/common';
import { LocalRequestTransporter } from '@mealz/backend-transport';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import { MealsGWCommonModule } from '@mealz/backend-meals-gateway-common';

import { GWUserMealMapper, MealsUserGWService } from './services';
import { MealsUserGWController } from './controllers';
import { MealsUserAPIModule } from '../service-api';

@Module({
  imports: [
    MealsCrudAPIModule.forRoot({}),
    MealsGWCommonModule,
    MealsUserAPIModule.forRoot({}),
  ],
  providers: [
    GWUserMealMapper,
    MealsUserGWService,
  ],
  controllers: [MealsUserGWController],
})
export class MealsUserGWModule {
}