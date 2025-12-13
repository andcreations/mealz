import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { USERS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { USERS_CRUD_DOMAIN, USERS_CRUD_SERVICE } from './domain-and-service';
import { UsersCrudTransporter } from './UsersCrudTransporter';

export interface UsersCrudAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class UsersCrudAPIModule {
  public static forRoot(
    options: UsersCrudAPIModuleOptions,
  ): DynamicModule {
    return {
      module: UsersCrudAPIModule,
      providers: [
        {
          provide: USERS_CRUD_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: USERS_CRUD_DOMAIN,
            service: USERS_CRUD_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        UsersCrudTransporter,
      ],
      exports: [
        UsersCrudTransporter,
      ],
    };
  }
}