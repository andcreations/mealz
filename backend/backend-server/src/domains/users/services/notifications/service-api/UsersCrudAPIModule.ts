import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  USERS_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  USERS_NOTIFICATIONS_DOMAIN,
  USERS_NOTIFICATIONS_SERVICE,
} from './domain-and-service';
import {
  UsersNotificationsTransporter,
} from './UsersNotificationsTransporter';

export interface UsersNotificationsAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class UsersNotificationsAPIModule {
  public static forRoot(
    options: UsersNotificationsAPIModuleOptions,
  ): DynamicModule {
    return {
      module: UsersNotificationsAPIModule,
      providers: [
        {
          provide: USERS_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: USERS_NOTIFICATIONS_DOMAIN,
            service: USERS_NOTIFICATIONS_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        UsersNotificationsTransporter,
      ],
      exports: [
        UsersNotificationsTransporter,
      ],
    };
  }
}