import { DynamicModule, Module, Type } from '@nestjs/common';
import { Transporter } from '#mealz/backend-transport';

import { USERS_AUTH_TRANSPORTER_TOKEN } from './inject-tokens';
import { UsersAuthTransporter } from './UsersAuthTransporter';

export interface UsersAuthAPIModuleOptions {
  transporter: Type<Transporter>;
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
          provide: USERS_AUTH_TRANSPORTER_TOKEN,
          useClass: options.transporter,
        },
        UsersAuthTransporter,
      ],
      exports: [
        UsersAuthTransporter,
      ],
    };
  }
}