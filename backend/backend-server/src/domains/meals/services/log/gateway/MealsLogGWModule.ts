import { Module } from '@nestjs/common';
import { MealsLogAPIModule } from '@mealz/backend-meals-log-service-api';

import { MealsLogGWService } from './services';
import { MealsLogGWController } from './controllers';

@Module({
  imports: [MealsLogAPIModule.forRoot({}),],
  providers: [MealsLogGWService],
  controllers: [MealsLogGWController],
})
export class MealsLogGWModule {
}