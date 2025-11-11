import { Module } from '@nestjs/common';
import {
  MealsDailyPlanAPIModule,
} from '@mealz/backend-meals-daily-plan-service-api';

import { GWMealDailyPlanMapper, MealsDailyPlanGWService } from './services';
import { MealsDailyPlanGWController } from './controllers';

@Module({
  imports: [MealsDailyPlanAPIModule.forRoot({})],
  providers: [GWMealDailyPlanMapper, MealsDailyPlanGWService],
  controllers: [MealsDailyPlanGWController],
})
export class MealsDailyPlanGWModule {}