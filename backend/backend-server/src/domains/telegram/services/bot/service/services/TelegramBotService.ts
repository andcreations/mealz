import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { isTelegramEnabled } from '@mealz/backend-telegram-common';
import {
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';
import {
  HandleUpdateRequestV1,
  SendMessageToUserRequestV1,
} from '@mealz/backend-telegram-bot-service-api';

import { TelegramBotClient } from './TelegramBotClient';
import { TelegramBotUpdateService } from './TelegramBotUpdateService';

@Injectable()
export class TelegramBotService {
  public constructor(
    private readonly logger: Logger,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    private readonly telegramBotClient: TelegramBotClient,
    private readonly telegramBotUpdateService: TelegramBotUpdateService,
  ) {}

  public async logWebhookTokenV1(
    context: Context,
  ): Promise<VoidTransporterResponse> {
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
    return {};
  }

  public async handleUpdateV1(
    request: HandleUpdateRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    await this.telegramBotUpdateService.handleUpdateV1(
      request.update,
      context,
    );
    return {};
  }

  public async sendMessageToUserV1(
    request: SendMessageToUserRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    if (!isTelegramEnabled()) {
      return {};
    }
    const {
      telegramUser,
    } = await this.telegramUsersTransporter.readTelegramUserV1(
      { userId: request.userId },
      context,
    );
    await this.telegramBotClient.sendMessage(
      {
        ...request.message,
        chat_id: telegramUser.telegramChatId,
      },
      context,
    );
    return {};
  }
}