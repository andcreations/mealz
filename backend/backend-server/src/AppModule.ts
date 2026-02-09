import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  Type,
} from '@nestjs/common';
import { SQLiteDBModule } from '@mealz/backend-db';
import { MetricsModule } from '@mealz/backend-metrics'
import { 
  CorrelationIdMiddleware,
  RequestLogMiddleware,
  MetricsMiddleware,
} from '@mealz/backend-gateway-common';

import {
  UsersDomainModule,
  IngredientsDomainModule,
  MealsDomainModule,
  HydrationDomainModule,
  TelegramDomainModule,
  AdminDomainModule,
  HealthDomainModule,
} from './domains';
import { getServeStaticModule } from './web-app';

const DOMAIN_MODULES = [
  UsersDomainModule,
  IngredientsDomainModule,
  MealsDomainModule,
  HydrationDomainModule,
  TelegramDomainModule,
  AdminDomainModule,
  HealthDomainModule,
]

@Module({
  imports: [
    getServeStaticModule(),
    SQLiteDBModule.forRoot(),
    MetricsModule.forRoot(),
    ...DOMAIN_MODULES,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(...this.getMiddlewares())
      .forRoutes('*');
  }

  private getMiddlewares(): Type<NestMiddleware>[] {
    return [
      CorrelationIdMiddleware,
      RequestLogMiddleware,
      MetricsMiddleware,
    ];
  }
}