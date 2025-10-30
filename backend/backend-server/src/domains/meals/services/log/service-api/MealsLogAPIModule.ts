import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { MEALS_LOG_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MEALS_LOG_DOMAIN, MEALS_LOG_SERVICE } from './domain-and-service';
import { MealsLogTransporter } from './MealsLogTransporter';

export interface MealsLogAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class MealsLogAPIModule {
  public static forRoot(
    options: MealsLogAPIModuleOptions,
  ): DynamicModule {
    return {
      module: MealsLogAPIModule,
      providers: [
        {
          provide: MEALS_LOG_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: MEALS_LOG_DOMAIN,
            service: MEALS_LOG_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        MealsLogTransporter,
      ],
      exports: [
        MealsLogTransporter,
      ],
    };
  }
}