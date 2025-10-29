import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { MEALS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsCrudTransporter } from './MealsCrudTransporter';

export interface MealsCrudAPIModuleOptions {
  requestTransporter?: RequestTransporter;
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
          provide: MEALS_CRUD_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: 'meals',
            service: 'crud',
            overrideTransporter: options.requestTransporter,
          }),
        },
        MealsCrudTransporter,
      ],
      exports: [
        MealsCrudTransporter,
      ],
    };
  }
}