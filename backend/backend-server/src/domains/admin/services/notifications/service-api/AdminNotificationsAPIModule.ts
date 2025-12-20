import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  ADMIN_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  ADMIN_NOTIFICATIONS_DOMAIN,
  ADMIN_NOTIFICATIONS_SERVICE,
} from './domain-and-service';
import {
  AdminNotificationsTransporter,
} from './AdminNotificationsTransporter';

export interface AdminNotificationsAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class AdminNotificationsAPIModule {
  public static forRoot(
    options: AdminNotificationsAPIModuleOptions,
  ): DynamicModule {
    return {
      module: AdminNotificationsAPIModule,
      providers: [
        {
          provide: ADMIN_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: ADMIN_NOTIFICATIONS_DOMAIN,
            service: ADMIN_NOTIFICATIONS_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        AdminNotificationsTransporter,
      ],
      exports: [
        AdminNotificationsTransporter,
      ],
    };
  }
}