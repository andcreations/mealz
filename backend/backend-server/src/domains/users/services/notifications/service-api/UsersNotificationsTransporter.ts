import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import {
  USERS_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN,
 } from './inject-tokens';
import {
  UsersNotificationsRequestTopics,
 } from './UsersNotificationsRequestTopics';
import { SendBasicUserNotificationRequestV1 } from './dtos';

export class UsersNotificationsTransporter {
  public constructor(
    @Inject(USERS_NOTIFICATIONS_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async sendBasicUserNotification(
    request: SendBasicUserNotificationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
    SendBasicUserNotificationRequestV1, VoidTransporterResponse
    >(
      UsersNotificationsRequestTopics.SendBasicUserNotificationV1,
      request,
      context,
    );
  }
}