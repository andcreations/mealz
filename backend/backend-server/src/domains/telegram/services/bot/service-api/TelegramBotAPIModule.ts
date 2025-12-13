import { DynamicModule, Module } from '@nestjs/common';
import {
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import {
  TELEGRAM_BOT_DOMAIN,
  TELEGRAM_BOT_SERVICE,
} from './domain-and-service';
import { TELEGRAM_BOT_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { TelegramBotTransporter } from './TelegramBotTransporter';

export interface TelegramBotAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class TelegramBotAPIModule {
  public static forRoot(
    options: TelegramBotAPIModuleOptions,
  ): DynamicModule {
    return {
      module: TelegramBotAPIModule,
      providers: [
        {
          provide: TELEGRAM_BOT_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: TELEGRAM_BOT_DOMAIN,
            service: TELEGRAM_BOT_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        TelegramBotTransporter,
      ],
      exports: [
        TelegramBotTransporter,
      ],
    };
  }
}