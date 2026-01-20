import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';
import { MetricsModule } from '@mealz/backend-metrics';

import { AIProvider } from './types';
import { OpenAIProvider } from './providers';

@Module({})
export class AIModule {
  public static forRoot(): DynamicModule {
    return {
      module: AIModule,
      imports: [
        LoggerModule,
        MetricsModule.forFeature(),
      ],
      providers: [
        {
          provide: AIProvider,
          useClass: OpenAIProvider,
        }
      ],
      exports: [
        AIProvider,
      ],
    };
  }
}