import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { 
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';
import { 
  TelegramBotTransporter,
} from '@mealz/backend-telegram-bot-service-api';
import { TelegramMessageBuilder } from '@andcreations/telegram-bot';
import {
  BasicUserNotification,
} from '@mealz/backend-users-notifications-service-api';


@Injectable()
export class TelegramUsersNotificationsService {
  public constructor(
    private readonly logger: Logger,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    private readonly telegramBotTransporter: TelegramBotTransporter,
  ) {}

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
    try {
      await this.telegramBotTransporter.sendMessageToUserV1(
        { 
          userId, 
          message: telegramMessage,
        },
        context,
      );
    } catch (error) {
      // TODO Add retry mechanism to send the notification again.
      this.logger.error(
        'Failed to send basic user notification to user',
        {
          ...context,
          userId,
        },
        error,
      );
    }
  }
}