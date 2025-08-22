import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { MEALS_USER_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsUserTransporter } from './MealsUserTransporter';

export interface MealsUserAPIModuleOptions {
  requestTransporter?: RequestTransporter;
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
          provide: MEALS_USER_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: 'meals',
            service: 'user',
            overrideTransporter: options.requestTransporter,
          }),
        },
        MealsUserTransporter,
      ],
      exports: [
        MealsUserTransporter,
      ],
    };
  }
}