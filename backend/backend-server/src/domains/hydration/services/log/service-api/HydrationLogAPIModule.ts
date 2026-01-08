import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  HYDRATION_LOG_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  HYDRATION_LOG_DOMAIN,
  HYDRATION_LOG_SERVICE,
} from './domain-and-service';
import {
  HydrationLogTransporter,
} from './HydrationLogTransporter';

export interface HydrationLogAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class HydrationLogAPIModule {
  public static forRoot(
    options: HydrationLogAPIModuleOptions,
  ): DynamicModule {
    return {
      module: HydrationLogAPIModule,
      providers: [
        {
          provide: HYDRATION_LOG_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: HYDRATION_LOG_DOMAIN,
            service: HYDRATION_LOG_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        HydrationLogTransporter,
      ],
      exports: [
        HydrationLogTransporter,
      ],
    };
  }
}