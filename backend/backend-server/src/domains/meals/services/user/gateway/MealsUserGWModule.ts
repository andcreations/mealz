import { Module } from '@nestjs/common';
import { LocalRequestTransporter } from '@mealz/backend-transport';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import { MealsGWCommonModule } from '@mealz/backend-meals-gateway-common';

import { GWUserMealMapper, MealsUserV1GWService } from './services';
import { MealsUserV1GWController } from './controllers';
import { MealsUserAPIModule } from '../service-api';

@Module({
  imports: [
    MealsCrudAPIModule.forRoot({}),
    MealsGWCommonModule,
    MealsUserAPIModule.forRoot({}),
  ],
  providers: [
    GWUserMealMapper,
    MealsUserV1GWService,
  ],
  controllers: [MealsUserV1GWController],
})
export class MealsUserGWModule {
}