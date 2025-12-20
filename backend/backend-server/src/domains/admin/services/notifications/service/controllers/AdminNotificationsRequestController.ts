import { Context } from '@mealz/backend-core';
import {
  RequestHandler,
  RequestController,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  AdminNotificationsRequestTopics,
  SendAdminNotificationRequestV1,
} from '@mealz/backend-admin-notifications-service-api';

import { AdminNotificationsService } from '../services';

@RequestController()
export class AdminNotificationsRequestController {
  public constructor(
    private readonly adminNotificationsService: AdminNotificationsService,
  ) {}

  @RequestHandler(AdminNotificationsRequestTopics.SendAdminNotificationV1)
  public async sendAdminNotificationV1(
    request: SendAdminNotificationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.adminNotificationsService.sendAdminNotificationV1(
      request,
      context,
    );
  }
}