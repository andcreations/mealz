import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { HandleUpdateRequestV1 } from '@mealz/backend-telegram-bot-service-api';

import { TelegramBotClient } from './TelegramBotClient';
import { TelegramBotUpdateService } from './TelegramBotUpdateService';

@Injectable()
export class TelegramBotService {
  public constructor(
    private readonly logger: Logger,
    private readonly telegramBotClient: TelegramBotClient,
    private readonly telegramBotUpdateService: TelegramBotUpdateService,
  ) {}

  public async logWebhookTokenV1(context: Context): Promise<void> {
    const info = await this.telegramBotClient.getWebhook();
    this.logger.info('Telegram webhook info', {
      ...context,
      info: {
        ...info,
        last_error_date: info.last_error_date
          ? new Date(info.last_error_date * 1000).toISOString()
          : 'unknown',
      },
    });
  }

  public async handleUpdateV1(
    request: HandleUpdateRequestV1,
    context: Context,
  ): Promise<void> {
    return this.telegramBotUpdateService.handleUpdateV1(
      request.update,
      context,
    );
  }
}