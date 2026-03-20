import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  EVENT_LOG_LOG_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  EVENT_LOG_LOG_DOMAIN,
  EVENT_LOG_LOG_SERVICE,
} from './domain-and-service';
import { EventLogTransporter } from './EventLogTransporter';

export interface EventLogAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class EventLogAPIModule {
  public static forRoot(
    options: EventLogAPIModuleOptions,
  ): DynamicModule {
    return {
      module: EventLogAPIModule,
      providers: [
        {
          provide: EVENT_LOG_LOG_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: EVENT_LOG_LOG_DOMAIN,
            service: EVENT_LOG_LOG_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        EventLogTransporter,
      ],
      exports: [
        EventLogTransporter,
      ],
    };
  }
}
