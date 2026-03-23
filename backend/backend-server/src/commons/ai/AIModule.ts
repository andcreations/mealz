import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { MetricsModule } from '@mealz/backend-metrics';

import { AI_FOR_SERVICE_OPTIONS } from './consts';
import { AIModuleForServiceOptions, AIProvider } from './types';
import { AISDKProvider } from './providers';

@Module({})
export class AIModule {
  public static forService(
    options: AIModuleForServiceOptions,
  ): DynamicModule {
    return {
      module: AIModule,
      imports: [
        LoggerModule,
        MetricsModule.forFeature(),
      ],
      providers: [
        {
          provide: AI_FOR_SERVICE_OPTIONS,
          useValue: {
            ...options,
            defaultModelName: options.defaultModelName ?? 'gpt-4o-mini',
          },
        },
        {
          provide: AIProvider,
          useClass: AISDKProvider,
        }
      ],
      exports: [
        AIProvider,
      ],
    };
  }
}