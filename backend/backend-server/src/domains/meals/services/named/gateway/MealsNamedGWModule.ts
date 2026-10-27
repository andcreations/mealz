import { Module } from '@nestjs/common';
import { UsersCrudAPIModule } from '@mealz/backend-users-crud-service-api';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import { MealsNamedAPIModule } from '@mealz/backend-meals-named-service-api';
import { MealsGWCommonModule } from '@mealz/backend-meals-gateway-common';

import {
  GWNamedMealMapper,
  GWShareUserMapper,
  MealsNamedGWService,
} from './services';
import { MealsNamedGWController } from './controllers';

@Module({
  imports: [
    UsersCrudAPIModule.forRoot({}),
    MealsCrudAPIModule.forRoot({}),
    MealsNamedAPIModule.forRoot({}),
    MealsGWCommonModule,
  ],
  providers: [MealsNamedGWService, GWNamedMealMapper, GWShareUserMapper],
  controllers: [MealsNamedGWController],
})
export class MealsNamedGWModule {}