import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  Type,
} from '@nestjs/common';
import { 
  CorrelationIdMiddleware,
  RequestLogMiddleware,
} from '#mealz/backend-gateway-common';

import { UsersDomainModule } from './domains';
import { getServeStaticModule } from './web-app';

@Module({
  imports: [
    getServeStaticModule(),
    UsersDomainModule,
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
    ];
  }
}