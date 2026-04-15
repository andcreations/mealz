import { DynamicModule, Module } from '@nestjs/common';
import { 
  EventTransporter,
  EventTransporterResolver,
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  HYDRATION_LOG_EVENT_TRANSPORTER_TOKEN,
  HYDRATION_LOG_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  HYDRATION_LOG_DOMAIN,
  HYDRATION_LOG_SERVICE,
} from './domain-and-service';
import {
  HydrationLogTransporter,
} from './HydrationLogTransporter';
import { HydrationLogEmitter } from './HydrationLogEmitter';

export interface HydrationLogAPIModuleOptions {
  requestTransporter?: RequestTransporter;
  eventTransporter?: EventTransporter;
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
        { 
          provide: HYDRATION_LOG_EVENT_TRANSPORTER_TOKEN,
          useValue: EventTransporterResolver.forService({
            domain: HYDRATION_LOG_DOMAIN,
            service: HYDRATION_LOG_SERVICE,
            overrideTransporter: options.eventTransporter,
          }),
        },
        HydrationLogTransporter,
        HydrationLogEmitter,
      ],
      exports: [
        HydrationLogTransporter,
        HydrationLogEmitter,
      ],
    };
  }
}