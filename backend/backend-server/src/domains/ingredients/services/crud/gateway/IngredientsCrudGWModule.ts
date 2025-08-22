import { Module } from '@nestjs/common';
import { LocalRequestTransporter } from '@mealz/backend-transport';
import {
  GWIngredientMapper,
  IngredientsGWCommonModule,
} from '@mealz/backend-ingredients-gateway-common';
import {
  IngredientsCrudAPIModule,
} from '@mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudGWService } from './services';
import { IngredientsCrudGWController } from './controllers';

@Module({
  imports: [
    IngredientsCrudAPIModule.forRoot({}),
    IngredientsGWCommonModule,
  ],
  providers: [
    IngredientsCrudGWService,
  ],
  controllers: [
    IngredientsCrudGWController,
  ],
})
export class IngredientsCrudGWModule {}