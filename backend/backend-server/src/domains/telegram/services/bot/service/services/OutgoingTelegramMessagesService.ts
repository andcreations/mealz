import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { Logger } from '@mealz/backend-logger';
import {
  DeleteMessagesByUserIdAndTypeIdRequestV1,
  OutgoingTelegramMessage,
  OutgoingTelegramMessageStatus,
} from '@mealz/backend-telegram-bot-service-api';

import { OutgoingTelegramMessagesRepository } from '../repositories';
import { TelegramBotClient } from './TelegramBotClient';

@Injectable()
export class OutgoingTelegramMessagesService {
  public constructor(
    private readonly logger: Logger,
    private readonly telegramBotClient: TelegramBotClient,
    private readonly outgoingTelegramMessagesRepository:
      OutgoingTelegramMessagesRepository,
  ) {}

  public async deleteMessagesByUserIdAndTypeIdV1(
    request: DeleteMessagesByUserIdAndTypeIdRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const updateStatus = async (
      message: OutgoingTelegramMessage,
      status: OutgoingTelegramMessageStatus,
    ) => {
      try {
        await this.outgoingTelegramMessagesRepository.updateStatusById(
          message.id,
          status,
          context,
        );
      } catch (error) {
        this.logger.error(
          'Failed to update status of outgoing Telegram message',
          context,
          error,
        );
      }
    };

    let lastId: string | undefined = undefined;
    const limit = 10;

    while (true) {
      // read messages
      const messages = await this.outgoingTelegramMessagesRepository
        .readByUserIdAndTypeIdFromLast(
          request.userId,
          request.typeId,
          lastId,
          limit,
          context,
        );
      if (!messages.length) {
        break;
      }

      // delete messages
      for (const message of messages) {
        try {
          await this.telegramBotClient.deleteMessage(
            message.telegramChatId,
            message.telegramMessageId,
            context,
          );
          await updateStatus(message, OutgoingTelegramMessageStatus.Deleted);
        } catch (error) {
          this.logger.error('Failed to delete Telegram message', context, error);
          await updateStatus(
            message,
            OutgoingTelegramMessageStatus.FailedToDelete,
          );
        }
      }

      // next
      if (messages.length < limit) {
        break;
      }
      lastId = messages[messages.length - 1].id;
    }
    return {};
  }
}
