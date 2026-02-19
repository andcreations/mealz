import { Module } from '@nestjs/common';
import {
  TelegramUsersAPIModule,
} from '@mealz/backend-telegram-users-service-api';

import { GWTelegramUserMapper, TelegramUsersGWService } from './services';
import { TelegramUsersGWController } from './controllers';

@Module({
  imports: [TelegramUsersAPIModule.forRoot({})],
  providers: [GWTelegramUserMapper, TelegramUsersGWService],
  controllers: [TelegramUsersGWController],
})
export class TelegramUsersGWModule {}