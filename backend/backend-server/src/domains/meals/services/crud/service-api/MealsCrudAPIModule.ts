import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { MEALS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MEALS_CRUD_DOMAIN, MEALS_CRUD_SERVICE } from './domain-and-service';
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
            domain: MEALS_CRUD_DOMAIN,
            service: MEALS_CRUD_SERVICE,
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