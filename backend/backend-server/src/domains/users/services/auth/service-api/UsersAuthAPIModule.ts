import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { USERS_AUTH_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { USERS_AUTH_DOMAIN, USERS_AUTH_SERVICE } from './domain-and-service';
import { UsersAuthTransporter } from './UsersAuthTransporter';

export interface UsersAuthAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class UsersAuthAPIModule {
  public static forRoot(
    options: UsersAuthAPIModuleOptions,
  ): DynamicModule {
    return {
      module: UsersAuthAPIModule,
      providers: [
        {
          provide: USERS_AUTH_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: USERS_AUTH_DOMAIN,
            service: USERS_AUTH_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        UsersAuthTransporter,
      ],
      exports: [
        UsersAuthTransporter,
      ],
    };
  }
}