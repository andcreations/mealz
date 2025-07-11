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
} from '@mealz/backend-gateway-common';

import { UsersDomainModule, IngredientsDomainModule } from './domains';
import { getServeStaticModule } from './web-app';

@Module({
  imports: [
    getServeStaticModule(),
    UsersDomainModule,
    IngredientsDomainModule,
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