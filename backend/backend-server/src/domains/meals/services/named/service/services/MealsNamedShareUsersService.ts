import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { User } from '@mealz/backend-users-common';
import { UsersCrudTransporter } from '@mealz/backend-users-crud-service-api';
import {
  UsersNotificationsTransporter,
} from '@mealz/backend-users-notifications-service-api';
import {
  ListShareUsersRequestV1,
  ListShareUsersResponseV1,
} from '@mealz/backend-meals-named-service-api';

@Injectable()
export class MealsNamedShareUsersService {
  public constructor(
    private readonly usersCrudTransporter: UsersCrudTransporter,
    private readonly usersNotificationsTransporter:
      UsersNotificationsTransporter,
  ) {}

  public async listShareUsersV1(
    request: ListShareUsersRequestV1,
    context: Context,
  ): Promise<ListShareUsersResponseV1> {
    const allUsers = await this.readAllUsers(context);
    const shareUsers: User[] = [];

    // filter users that are not shareable
    for (const user of allUsers) {
      if (user.id === request.userId) {
        continue;
      }

      const isShareable = await this.isShareable(user, context);
      if (isShareable) {
        shareUsers.push(user);
      }
    }

    return { shareUsers };
  }

  private async isShareable(
    user: User,
    context: Context,
  ): Promise<boolean> {
    const {
      canSendMessagesTo
    } = await this.usersNotificationsTransporter.readUserNotificationsInfoV1(
      { userId: user.id },
      context,
    );
    return canSendMessagesTo;
  }

  private async readAllUsers(
    context: Context,
  ): Promise<User[]> {
    const allUsers: User[] = [];
    let lastId: string | undefined = undefined;
    const limit = 100;

    // loop until all users are read
    while (true) {
      const {
        users: usersBatch
      } = await this.usersCrudTransporter.readUsersFromLastV1(
        { lastId, limit },
        context,
      );
      allUsers.push(...usersBatch);
      if (usersBatch.length < limit) {
        break;
      }
      lastId = usersBatch[usersBatch.length - 1].id;
    }

    return allUsers;
  }
}