import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';

import { AIProvider } from './types';
import { OpenAIProvider } from './providers';

@Module({})
export class AIModule {
  public static forRoot(): DynamicModule {
    return {
      module: AIModule,
      imports: [
        LoggerModule,
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