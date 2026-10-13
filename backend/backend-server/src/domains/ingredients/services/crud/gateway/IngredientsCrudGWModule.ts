import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { SocketAPIModule } from '@mealz/backend-socket-api';
import {
  IngredientsGWCommonModule,
} from '@mealz/backend-ingredients-gateway-common';
import {
  IngredientsCrudAPIModule,
} from '@mealz/backend-ingredients-crud-service-api';

import { IngredientsCrudV1GWService } from './services';
import { IngredientsCrudV1GWController } from './controllers';

@Module({
  imports: [
    LoggerModule,
    SocketAPIModule.forRoot({}),
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