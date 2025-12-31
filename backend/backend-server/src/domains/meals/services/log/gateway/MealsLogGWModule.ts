import { Module } from '@nestjs/common';
import { MealsGWCommonModule } from '@mealz/backend-meals-gateway-common';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import { MealsLogAPIModule } from '@mealz/backend-meals-log-service-api';

import { GWMealLogMapper, MealsLogGWService } from './services';
import { MealsLogGWController } from './controllers';

@Module({
  imports: [
    MealsGWCommonModule,
    MealsCrudAPIModule.forRoot({}),
    MealsLogAPIModule.forRoot({}),
  ],
  providers: [GWMealLogMapper, MealsLogGWService],
  controllers: [MealsLogGWController],
})
export class MealsLogGWModule {
}