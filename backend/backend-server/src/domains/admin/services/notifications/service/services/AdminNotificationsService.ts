import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
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
  ): Promise<void> {
    await this.telegramAdminNotificationsService.sendAdminNotification(
      request.notification,
      context,
    );
  }
}