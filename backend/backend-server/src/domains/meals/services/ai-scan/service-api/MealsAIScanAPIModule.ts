import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { MEALS_AI_SCAN_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { 
  MEALS_AI_SCAN_DOMAIN, 
  MEALS_AI_SCAN_SERVICE,
} from './domain-and-service';
import { MealsAIScanTransporter } from './MealsAIScanTransporter';

export interface MealsAIScanAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class MealsAIScanAPIModule {
  public static forRoot(
    options: MealsAIScanAPIModuleOptions,
  ): DynamicModule {
    return {
      module: MealsAIScanAPIModule,
      providers: [
        {
          provide: MEALS_AI_SCAN_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: MEALS_AI_SCAN_DOMAIN,
            service: MEALS_AI_SCAN_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        MealsAIScanTransporter,
      ],
      exports: [
        MealsAIScanTransporter,
      ],
    };
  }
}