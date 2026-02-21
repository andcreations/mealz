import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { USERS_PROPERTIES_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { 
  USERS_PROPERTIES_DOMAIN, 
  USERS_PROPERTIES_SERVICE,
} from './domain-and-service';
import { UsersPropertiesTransporter } from './UsersPropertiesTransporter';

export interface UsersPropertiesAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class UsersPropertiesAPIModule {
  public static forRoot(
    options: UsersPropertiesAPIModuleOptions,
  ): DynamicModule {
    return {
      module: UsersPropertiesAPIModule,
      providers: [
        {
          provide: USERS_PROPERTIES_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: USERS_PROPERTIES_DOMAIN,
            service: USERS_PROPERTIES_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        UsersPropertiesTransporter,
      ],
      exports: [
        UsersPropertiesTransporter,
      ],
    };
  }
}
