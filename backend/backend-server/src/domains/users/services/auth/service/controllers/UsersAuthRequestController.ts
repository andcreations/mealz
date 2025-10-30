import { Context } from '@mealz/backend-core';
import { RequestController,RequestHandler } from '@mealz/backend-transport';
import {
  UsersAuthRequestTopics,
  AuthUserRequestV1,
  AuthUserResponseV1,
} from '@mealz/backend-users-auth-service-api';

import { UsersAuthService } from '../services';

@RequestController()
export class UsersAuthRequestController {
  public constructor(
    private readonly usersAuthService: UsersAuthService,
  ) {}

  @RequestHandler(UsersAuthRequestTopics.AuthUserV1)
  public async authUserV1(
    request: AuthUserRequestV1,
    context: Context,
  ): Promise<AuthUserResponseV1> {
    return this.usersAuthService.authUserV1(request, context);
  }
}