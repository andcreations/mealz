import { Module } from '@nestjs/common';
import { LocalTransporter } from '#mealz/backend-transport';
import {
  GWIngredientMapper,
} from '#mealz/backend-ingredients-gateway-common';
import {
  IngredientsCrudAPIModule,
} from '#mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudGWService } from './services';
import { IngredientsCrudGWController } from './controllers';

@Module({
  imports: [
    IngredientsCrudAPIModule.forRoot({
      transporter: LocalTransporter,
    }),
  ],
  providers: [
    GWIngredientMapper,
    IngredientsCrudGWService,
  ],
  controllers: [
    IngredientsCrudGWController,
  ],
})
export class IngredientsCrudGWModule {}