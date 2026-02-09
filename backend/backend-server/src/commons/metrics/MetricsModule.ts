import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';

import { 
  MetricsAuthService,
  MetricsService,
  PrometheusMetricsService,
  SystemMetricsService,
} from './services';
import { MetricsPrometheusController } from './controllers';

@Module({})
export class MetricsModule {
  public static forRoot(): DynamicModule {
    return {
      module: MetricsModule,
      imports: [
        LoggerModule,
      ],
      providers: [
        MetricsService,
        MetricsAuthService,
        SystemMetricsService,
        PrometheusMetricsService,
      ],
      exports: [],
      controllers: [
        MetricsPrometheusController,
      ],
    };
  }

  public static forFeature(): DynamicModule {
    return {
      module: MetricsModule,
      imports: [],
      providers: [MetricsService],
      exports: [MetricsService],
    };
  }
}