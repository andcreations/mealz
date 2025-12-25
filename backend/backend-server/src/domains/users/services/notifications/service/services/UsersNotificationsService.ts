import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { 
  TelegramUsersTransporter,
} from '@mealz/backend-telegram-users-service-api';
import {
  ReadUserNotificationsInfoRequestV1,
  ReadUserNotificationsInfoResponseV1,
  SendBasicUserNotificationRequestV1,
  SendChunkedUserNotificationRequestV1,
} from '@mealz/backend-users-notifications-service-api';

import {
  TelegramUsersNotificationsService,
} from './TelegramUsersNotificationsService';

@Injectable()
export class UsersNotificationsService {
  public constructor(
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
    private readonly telegramUsersNotificationsService: TelegramUsersNotificationsService,
  ) {}

  public async sendBasicUserNotificationV1(
    request: SendBasicUserNotificationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    await this.telegramUsersNotificationsService.sendBasicUserNotification(
      request.notification,
      request.userId,
      context,
    );
    return {};
  }

  public async sendChunkedUserNotificationV1(
    request: SendChunkedUserNotificationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    await this.telegramUsersNotificationsService.sendChunkedUserNotification(
      request.notification,
      request.userId,
      context,
    );
    return {};
  }

  public async readUserNotificationsInfoV1(
    request: ReadUserNotificationsInfoRequestV1,
    context: Context,
  ): Promise<ReadUserNotificationsInfoResponseV1> {
    const { 
      canSendMessagesTo,
    } = await this.telegramUsersTransporter.readTelegramUserInfoV1(
      { userId: request.userId },
      context,
    );

    return {
      canSendMessagesTo,
    }
  }
}
