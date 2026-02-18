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
  OutgoingTelegramMessageStatus,
  SendMessageToUserRequestV1,
} from '@mealz/backend-telegram-bot-service-api';

import { TelegramBotClient } from './TelegramBotClient';
import { TelegramBotUpdateService } from './TelegramBotUpdateService';
import { OutgoingTelegramMessagesRepository } from '../repositories';

@Injectable()
export class TelegramBotService {
  public constructor(
    private readonly logger: Logger,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    private readonly telegramBotClient: TelegramBotClient,
    private readonly telegramBotUpdateService: TelegramBotUpdateService,
    private readonly outgoingTelegramMessagesRepository:
      OutgoingTelegramMessagesRepository,
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

    // read telegram user
    const {
      telegramUser,
    } = await this.telegramUsersTransporter.readTelegramUserV1(
      { userId: request.userId },
      context,
    );

    // insert outgoing telegram message
    const insertOutgoingTelegramMessage = async (
      status: OutgoingTelegramMessageStatus,
      telegramMessageId: number,
    ) => {
      try {
        await this.outgoingTelegramMessagesRepository.create(
          {
            userId: request.userId,
            typeId: request.messageTypeId,
            telegramChatId: telegramUser.telegramChatId,
            telegramMessageId,
            content: request.message,
            status,
          },
          context,
        );
      } catch (error) {
        this.logger.error(
          'Failed to insert outgoing telegram message',
          context,
          error,
        );
      }
    };

    // send message
    try {
      const result = await this.telegramBotClient.sendMessage(
        {
          ...request.message,
          chat_id: telegramUser.telegramChatId,
        },
        context,
      );
      await insertOutgoingTelegramMessage(
        OutgoingTelegramMessageStatus.Sent,
        result.message_id,
      );
    } catch (error) {
      await insertOutgoingTelegramMessage(
        OutgoingTelegramMessageStatus.FailedToSend,
        0,
      );
      throw error;
    }
    return {};
  }
}