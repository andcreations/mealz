import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import {
  ADMIN_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN,
} from './inject-tokens';
import {
  AdminNotificationsRequestTopics,
} from './AdminNotificationsRequestTopics';
import { SendAdminNotificationRequestV1 } from './dtos';

@Injectable()
export class AdminNotificationsTransporter {
  public constructor(
    @Inject(ADMIN_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async sendAdminNotificationV1(
    request: SendAdminNotificationRequestV1,
    context: Context,
  ): Promise<void> {
    await this.transporter.sendRequest(
      AdminNotificationsRequestTopics.SendAdminNotificationV1,
      request,
      context,
    );
  }
}