import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  Type,
} from '@nestjs/common';
import { SQLiteDBModule } from '@mealz/backend-db';
import { 
  CorrelationIdMiddleware,
  RequestLogMiddleware,
} from '@mealz/backend-gateway-common';

import {
  UsersDomainModule,
  IngredientsDomainModule,
  MealsDomainModule,
  TelegramDomainModule,
} from './domains';
import { getServeStaticModule } from './web-app';

@Module({
  imports: [
    getServeStaticModule(),
    SQLiteDBModule.forRoot(),
    UsersDomainModule,
    IngredientsDomainModule,
    MealsDomainModule,
    TelegramDomainModule,
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