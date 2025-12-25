import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { 
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';
import { 
  TelegramBotTransporter,
} from '@mealz/backend-telegram-bot-service-api';
import { 
  TelegramMessageBuilder, 
  TelegramAnonymousMessage,
} from '@andcreations/telegram-bot';
import {
  BasicUserNotification,
  ChunkedUserNotification,
  ChunkedUserNotificationType,
} from '@mealz/backend-users-notifications-service-api';


@Injectable()
export class TelegramUsersNotificationsService {
  public constructor(
    private readonly logger: Logger,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    private readonly telegramBotTransporter: TelegramBotTransporter,
  ) {}

  private async sendTelegramMessageToUser(
    userId: string,
    message: TelegramAnonymousMessage,
    context: Context,
  ): Promise<void> {
    try {
      await this.telegramBotTransporter.sendMessageToUserV1(
        { userId, message },
        context,
      );
    } catch (error) {
      // TODO Add retry mechanism to send the notification again.
      this.logger.error(
        'Failed to send Telegram message to user',
        { ...context, userId },
        error,
      );
    }
  }

  public async sendBasicUserNotification(
    notification: BasicUserNotification,
    userId: string,
    context: Context,
  ): Promise<void> {
    // check if the message can be sent to the user
    const userInfo = await this.telegramUsersTransporter.readTelegramUserInfoV1(
      { userId },
      context,
    );
    if (!userInfo.canSendMessagesTo) {
      return;
    }

    // build Telegram message
    const telegramMessage = TelegramMessageBuilder.fromString(
      notification.message,
    );

    // send
    await this.sendTelegramMessageToUser(userId, telegramMessage, context);
  }

  private buildChunkedTelegramMessage(
    notification: ChunkedUserNotification,
  ): TelegramAnonymousMessage {
    const builder = new TelegramMessageBuilder();
    for (const chunk of notification.chunks) {
      switch (chunk.type) {
        case ChunkedUserNotificationType.Normal:
          builder.normal(chunk.text);
          break;
        case ChunkedUserNotificationType.Bold:
          builder.bold(chunk.text);
          break;
        case ChunkedUserNotificationType.Code:
          builder.code(chunk.text);
          break;
      }
    }
    return builder.build();
  }

  public async sendChunkedUserNotification(
    notification: ChunkedUserNotification,
    userId: string,
    context: Context,
  ): Promise<void> {
    // check if the message can be sent to the user
    const userInfo = await this.telegramUsersTransporter.readTelegramUserInfoV1(
      { userId },
      context,
    );
    if (!userInfo.canSendMessagesTo) {
      return;
    }

    // build Telegram message
    const telegramMessage = this.buildChunkedTelegramMessage(notification);

    // send
    await this.sendTelegramMessageToUser(userId, telegramMessage, context);
  }
}