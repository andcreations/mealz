import { DynamicModule, Module } from '@nestjs/common';
import { RequestTransporter, RequestTransporterResolver } from '@mealz/backend-transport';
import { SOCKET_DOMAIN, SOCKET_SERVICE } from './domain-and-service';
import { SOCKET_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { SocketRequestTransporter } from './SocketRequestTransporter';

export interface SocketAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class SocketAPIModule {
  public static forRoot(
    options: SocketAPIModuleOptions,
  ): DynamicModule {
    return {
      module: SocketAPIModule,
      providers: [
        {
          provide: SOCKET_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: SOCKET_DOMAIN,
            service: SOCKET_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        SocketRequestTransporter,
      ],
      exports: [
        SocketRequestTransporter,
      ],
    };
  }
}