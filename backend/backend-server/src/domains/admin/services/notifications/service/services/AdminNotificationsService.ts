import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { VoidTransporterResponse } from '@mealz/backend-transport';

import {
  SendAdminNotificationRequestV1,
} from '@mealz/backend-admin-notifications-service-api';
import {
  TelegramAdminNotificationsService,
} from './TelegramAdminNotificationsService';

@Injectable()
export class AdminNotificationsService {
  public constructor(
    private readonly telegramAdminNotificationsService: TelegramAdminNotificationsService,
  ) {}

  public async sendAdminNotificationV1(
    request: SendAdminNotificationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    await this.telegramAdminNotificationsService.sendAdminNotification(
      request.notification,
      context,
    );
    return {};
  }
}