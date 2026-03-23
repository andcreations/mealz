import { DynamicModule, Module } from '@nestjs/common';
import { 
  RequestTransporter,
  RequestTransporterResolver,
} from '@mealz/backend-transport';

import { AI_TOOLS_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { AI_TOOLS_DOMAIN, AI_TOOLS_SERVICE } from './domain-and-service';
import { AIToolsTransporter } from './AIToolsTransporter';

export interface AIToolsAPIModuleOptions {
  requestTransporter?: RequestTransporter;
}

@Module({})
export class AIToolsAPIModule {
  public static forRoot(
    options: AIToolsAPIModuleOptions,
  ): DynamicModule {
    return {
      module: AIToolsAPIModule,
      providers: [
        {
          provide: AI_TOOLS_REQUEST_TRANSPORTER_TOKEN,
          useValue: RequestTransporterResolver.forService({
            domain: AI_TOOLS_DOMAIN,
            service: AI_TOOLS_SERVICE,
            overrideTransporter: options.requestTransporter,
          }),
        },
        AIToolsTransporter,
      ],
      exports: [
        AIToolsTransporter,
      ],
    };
  }
}
