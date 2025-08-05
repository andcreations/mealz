import { DynamicModule, Module, Type } from '@nestjs/common';
import { Transporter } from '@mealz/backend-transport';

import { MEALS_USER_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsUserTransporter } from './MealsUserTransporter';

export interface MealsUserAPIModuleOptions {
  transporter: Type<Transporter>;
}

@Module({})
export class MealsUserAPIModule {
  public static forRoot(
    options: MealsUserAPIModuleOptions,
  ): DynamicModule {
    return {
      module: MealsUserAPIModule,
      providers: [
        {
          provide: MEALS_USER_TRANSPORTER_TOKEN,
          useClass: options.transporter,
        },
        MealsUserTransporter,
      ],
      exports: [
        MealsUserTransporter,
      ],
    };
  }
}