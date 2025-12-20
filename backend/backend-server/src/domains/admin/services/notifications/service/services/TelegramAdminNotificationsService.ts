import { Injectable } from '@nestjs/common';
import { 
  TelegramAnonymousMessage,
  TelegramMessageBuilder,
} from '@andcreations/telegram-bot';
import { Context } from '@mealz/backend-core';
import { getStrEnv } from '@mealz/backend-common';
import { Logger } from '@mealz/backend-logger';
import {
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';
import {
  TelegramBotTransporter,
} from '@mealz/backend-telegram-bot-service-api';
import {
  AdminNotification,
  AdminNotificationType,
} from '@mealz/backend-admin-notifications-service-api';

@Injectable()
export class TelegramAdminNotificationsService {
  private readonly telegramAdminUserIds: string[];

  public constructor(
    private readonly logger: Logger,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    private readonly telegramBotTransporter: TelegramBotTransporter,
  ) {
    this.telegramAdminUserIds = this.resolveTelegramAdminUserIds();
  }

  private resolveTelegramAdminUserIds(): string[] {
    return getStrEnv('MEALZ_TELEGRAM_ADMIN_USER_IDS', '')
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '');
  }

  private buildTelegramMessage(
    notification: AdminNotification,
  ): TelegramAnonymousMessage {
    const builder = new TelegramMessageBuilder();
    if (notification.type) {
      switch (notification.type) {
        case AdminNotificationType.Info:
          builder.normal('🔹 ');
          break;
        case AdminNotificationType.Warning:
          builder.normal('🔸 ');
          break;
        case AdminNotificationType.Error:
          builder.normal('🔺 ');
          break;
      }
    }
    if (notification.title) {
      builder.bold(notification.title);
    }
    if (notification.message) {
      if (notification.title) {
        builder.newLine();
      }
      builder.normal(notification.message);
    }
    return builder.build();
  }

  public async sendAdminNotification(
    notification: AdminNotification,
    context: Context,
  ): Promise<void> {
    if (this.telegramAdminUserIds.length === 0) {
      return;
    }

    // build message
    const telegramMessage = this.buildTelegramMessage(notification);

    // send to each telegram admin user
    for (const userId of this.telegramAdminUserIds) {
      try {
        await this.sendAdminNotificationToUser(telegramMessage, userId, context);
      } catch (error) {
        this.logger.error(
          'Error sending notification to Telegram admin user',
          {
            ...context,
            userId,
          },
          error,
        );
      }
    }
  }

  private async sendAdminNotificationToUser(
    telegramMessage: TelegramAnonymousMessage,
    userId: string,
    context: Context,
  ): Promise<void> {
    const userInfo = await this.telegramUsersTransporter.readTelegramUserInfoV1(
      { userId },
      context,
    );
    if (!userInfo.canSendMessagesTo) {
      return;
    }
    await this.telegramBotTransporter.sendMessageToUserV1(
      { 
        userId, 
        message: telegramMessage,
      },
      context,
    );
  }
}