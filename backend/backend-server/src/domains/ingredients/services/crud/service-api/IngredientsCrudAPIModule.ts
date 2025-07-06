import { DynamicModule, Module, Type } from '@nestjs/common';
import { Transporter } from '#mealz/backend-transport';

import { INGREDIENTS_CRUD_TRANSPORTER_TOKEN } from './inject-tokens';
import { IngredientsCrudTransporter } from './IngredientsCrudTransporter';

export interface IngredientsCrudAPIModuleOptions {
  transporter: Type<Transporter>;
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
          provide: INGREDIENTS_CRUD_TRANSPORTER_TOKEN,
          useClass: options.transporter,
        },
        IngredientsCrudTransporter,
      ],
      exports: [
        IngredientsCrudTransporter,
      ],
    };
  }
}