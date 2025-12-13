import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { TELEGRAM_USERS_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import {
  TELEGRAM_USERS_DOMAIN,
  TELEGRAM_USERS_SERVICE,
} from './domain-and-service';
import { TelegramUsersTransporter } from './TelegramUsersTransporter';

export interface TelegramUsersAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class TelegramUsersAPIModule {
  public static forRoot(
    options: TelegramUsersAPIModuleOptions,
  ): DynamicModule {
    return {
      module: TelegramUsersAPIModule,
      providers: [
        {
          provide: TELEGRAM_USERS_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: TELEGRAM_USERS_DOMAIN,
            service: TELEGRAM_USERS_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        TelegramUsersTransporter,
      ],
      exports: [
        TelegramUsersTransporter,
      ],
    };
  }
}