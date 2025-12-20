import { 
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import { Context } from '@mealz/backend-core';
import { 
  SendBasicUserNotificationRequestV1,
  UsersNotificationsRequestTopics,
 } from '@mealz/backend-users-notifications-service-api';

import { UsersNotificationsService } from '../services';

@RequestController()
export class UsersNotificationsRequestController {
  public constructor(
    private readonly usersNotificationsService: UsersNotificationsService,
  ) {}

  @RequestHandler(UsersNotificationsRequestTopics.SendBasicUserNotificationV1)
  public async sendBasicUserNotification(
    request: SendBasicUserNotificationRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.usersNotificationsService.sendBasicUserNotificationV1(
      request,
      context,
    );
  }
}