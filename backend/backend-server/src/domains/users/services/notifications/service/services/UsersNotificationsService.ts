import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import {
  SendBasicUserNotificationRequestV1,
} from '@mealz/backend-users-notifications-service-api';

import {
  TelegramUsersNotificationsService,
} from './TelegramUsersNotificationsService';

@Injectable()
export class UsersNotificationsService {
  public constructor(
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
}
