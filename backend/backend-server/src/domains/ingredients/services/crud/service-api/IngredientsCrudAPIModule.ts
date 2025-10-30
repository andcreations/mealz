import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { INGREDIENTS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import {
  INGREDIENTS_CRUD_DOMAIN,
  INGREDIENTS_CRUD_SERVICE,
} from './domain-and-service';
import {
  IngredientsCrudTransporter,
} from './IngredientsCrudTransporter';

export interface IngredientsCrudAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class IngredientsCrudAPIModule {
  public static forRoot(
    options: IngredientsCrudAPIModuleOptions,
  ): DynamicModule {
    return {
      module: IngredientsCrudAPIModule,
      providers: [
        {
          provide: INGREDIENTS_CRUD_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: INGREDIENTS_CRUD_DOMAIN,
            service: INGREDIENTS_CRUD_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        IngredientsCrudTransporter,
      ],
      exports: [
        IngredientsCrudTransporter,
      ],
    };
  }
}