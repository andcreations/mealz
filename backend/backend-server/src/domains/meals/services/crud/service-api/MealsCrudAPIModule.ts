import { DynamicModule, Module, Type } from '@nestjs/common';
import { Transporter } from '@mealz/backend-transport';

import { MEALS_CRUD_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsCrudTransporter } from './MealsCrudTransporter';

export interface MealsCrudAPIModuleOptions {
  transporter: Type<Transporter>;
}

@Module({})
export class MealsCrudAPIModule {
  public static forRoot(
    options: MealsCrudAPIModuleOptions,
  ): DynamicModule {
    return {
      module: MealsCrudAPIModule,
      providers: [
        {
          provide: MEALS_CRUD_TRANSPORTER_TOKEN,
          useClass: options.transporter,
        },
        MealsCrudTransporter,
      ],
      exports: [
        MealsCrudTransporter,
      ],
    };
  }
}