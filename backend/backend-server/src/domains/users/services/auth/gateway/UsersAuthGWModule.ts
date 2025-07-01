import { Module } from '@nestjs/common';
import { LocalTransporter } from '#mealz/backend-transport';
import { UsersAuthAPIModule } from '#mealz/backend-users-auth-service-api';

import { UserAuthGWController } from './controllers';
import { UserAuthGWService } from './services';

@Module({
  imports: [
    UsersAuthAPIModule.forRoot({
      transporter: LocalTransporter,
    }),
  ],
  providers: [
    UserAuthGWService,
  ],
  controllers: [
    UserAuthGWController,
  ],
})
export class UsersAuthGWModule {
}