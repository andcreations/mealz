import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { MEALS_NAMED_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MEALS_NAMED_DOMAIN, MEALS_NAMED_SERVICE } from './domain-and-service';
import { MealsNamedTransporter } from './MealsNamedTransporter';

export interface MealsNamedAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class MealsNamedAPIModule {
  public static forRoot(
    options: MealsNamedAPIModuleOptions,
  ): DynamicModule {
    return {
      module: MealsNamedAPIModule,
      providers: [
        {
          provide: MEALS_NAMED_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: MEALS_NAMED_DOMAIN,
            service: MEALS_NAMED_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        MealsNamedTransporter,
      ],
      exports: [
        MealsNamedTransporter,
      ],
    };
  }
}