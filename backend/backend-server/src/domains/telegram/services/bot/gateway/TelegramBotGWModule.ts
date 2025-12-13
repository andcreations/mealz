import { Module } from '@nestjs/common';
import { TelegramBotAPIModule } from '@mealz/backend-telegram-bot-service-api';

import { TelegramBotWebhookGWController } from './controllers';
import { TelegramBotWebhookGWService } from './services';

@Module({
  imports: [TelegramBotAPIModule.forRoot({})],
  providers: [TelegramBotWebhookGWService],
  controllers: [TelegramBotWebhookGWController],
})
export class TelegramBotGWModule {
}