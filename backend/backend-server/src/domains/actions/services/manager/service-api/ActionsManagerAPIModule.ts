import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  ACTIONS_MANAGER_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  ACTIONS_MANAGER_DOMAIN,
  ACTIONS_MANAGER_SERVICE,
} from './domain-and-service';
import {
  ActionsManagerTransporter,
} from './ActionsManagerTransporter';

export interface ActionsManagerAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class ActionsManagerAPIModule {
  public static forRoot(
    options: ActionsManagerAPIModuleOptions,
  ): DynamicModule {
    return {
      module: ActionsManagerAPIModule,
      providers: [
        {
          provide: ACTIONS_MANAGER_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: ACTIONS_MANAGER_DOMAIN,
            service: ACTIONS_MANAGER_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        ActionsManagerTransporter,
      ],
      exports: [
        ActionsManagerTransporter,
      ],
    };
  }
}