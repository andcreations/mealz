import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { MealsCommonModule } from '@mealz/backend-meals-common';
import { AIModule } from '@mealz/backend-ai';
import { UsersCrudAPIModule } from '@mealz/backend-users-crud-service-api';
import { MealsLogAPIModule } from '@mealz/backend-meals-log-service-api';
import { MealsCrudAPIModule } from '@mealz/backend-meals-crud-service-api';
import { 
  MealsDailyPlanAPIModule,
} from '@mealz/backend-meals-daily-plan-service-api';
import { 
  UsersNotificationsAPIModule,
} from '@mealz/backend-users-notifications-service-api';

import { UsersDailyInsightsService } from './services';

@Module({
  imports: [
    LoggerModule,
    MealsCommonModule,
    AIModule.forRoot(),
    UsersCrudAPIModule.forRoot({}),
    MealsLogAPIModule.forRoot({}),
    MealsCrudAPIModule.forRoot({}),
    MealsDailyPlanAPIModule.forRoot({}),
    UsersNotificationsAPIModule.forRoot({}),
  ],
  providers: [
    UsersDailyInsightsService,
  ],
})
export class UsersInsightsModule {}