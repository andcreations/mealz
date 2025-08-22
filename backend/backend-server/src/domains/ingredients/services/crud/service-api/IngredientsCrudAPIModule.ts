import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { INGREDIENTS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { IngredientsCrudTransporter } from './IngredientsCrudTransporter';

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
            domain: 'ingredients',
            service: 'crud',
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