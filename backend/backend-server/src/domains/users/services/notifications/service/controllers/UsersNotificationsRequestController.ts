import { 
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import { Context } from '@mealz/backend-core';
import { 
  ReadUserNotificationsInfoRequestV1,
  ReadUserNotificationsInfoResponseV1,
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

  @RequestHandler(UsersNotificationsRequestTopics.ReadUserNotificationsInfoV1)
  public async readUserNotificationsInfoV1(
    request: ReadUserNotificationsInfoRequestV1,
    context: Context,
  ): Promise<ReadUserNotificationsInfoResponseV1> {
    return this.usersNotificationsService.readUserNotificationsInfoV1(
      request,
      context,
    );
  }
}