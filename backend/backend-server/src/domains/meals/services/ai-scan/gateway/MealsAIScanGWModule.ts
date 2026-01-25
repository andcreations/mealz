import { Module } from '@nestjs/common';
import { uploadAdapterProvider } from '@mealz/backend-gateway-common';
import { MealsAIScanAPIModule } from '@mealz/backend-meals-ai-scan-service-api';

import { MealsAIScanGWService } from './services';
import { MealsAIScanGWController } from './controllers';

@Module({
  imports: [
    MealsAIScanAPIModule.forRoot({}),
  ],
  providers: [
    uploadAdapterProvider(),
    MealsAIScanGWService,
  ],
  controllers: [MealsAIScanGWController],
})
export class MealsAIScanGWModule {}