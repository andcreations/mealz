import { Module } from '@nestjs/common';
import { MealsAIScanAPIModule } from '@mealz/backend-meals-ai-scan-service-api';

import { GWScanPhotoMealMapper, MealsAIScanGWService } from './services';
import { MealsAIScanGWController } from './controllers';

@Module({
  imports: [
    MealsAIScanAPIModule.forRoot({}),
  ],
  providers: [
    GWScanPhotoMealMapper,
    MealsAIScanGWService,
  ],
  controllers: [MealsAIScanGWController],
})
export class MealsAIScanGWModule {}