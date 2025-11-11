import { Module } from '@nestjs/common';
import { LocalRequestTransporter } from '@mealz/backend-transport';
import {
  GWIngredientMapper,
  IngredientsGWCommonModule,
} from '@mealz/backend-ingredients-gateway-common';
import {
  IngredientsCrudAPIModule,
} from '@mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudV1GWService } from './services';
import { IngredientsCrudV1GWController } from './controllers';

@Module({
  imports: [
    IngredientsCrudAPIModule.forRoot({}),
    IngredientsGWCommonModule,
  ],
  providers: [
    IngredientsCrudV1GWService,
  ],
  controllers: [
    IngredientsCrudV1GWController,
  ],
})
export class IngredientsCrudGWModule {}