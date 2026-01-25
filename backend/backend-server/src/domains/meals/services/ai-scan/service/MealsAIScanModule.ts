import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { AIModule } from '@mealz/backend-ai';
import {
  MEALS_AI_SCAN_DOMAIN,
  MEALS_AI_SCAN_SERVICE,
} from '@mealz/backend-meals-ai-scan-service-api';

import { MealPhotoScanner, MealsAIScanService } from './services';
import { MealsAIScanRequestController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    AIModule.forService({
      domain: MEALS_AI_SCAN_DOMAIN,
      service: MEALS_AI_SCAN_SERVICE,
    }),
  ],
  providers: [
    MealPhotoScanner,
    MealsAIScanService,
    MealsAIScanRequestController,
  ],
})
export class MealsAIScanModule {}