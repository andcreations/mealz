import { Context } from '@mealz/backend-core';
import { TransportController,RequestHandler } from '@mealz/backend-transport';
import {
  UsersAuthTopics,
  AuthUserRequestV1,
  AuthUserResponseV1,
} from '@mealz/backend-users-auth-service-api';

import { UsersAuthService } from '../services';

@TransportController()
export class UsersAuthTransportController {
  public constructor(
    private readonly usersAuthService: UsersAuthService,
  ) {}

  @RequestHandler(UsersAuthTopics.AuthUserV1)
  public async authUserV1(
    request: AuthUserRequestV1,
    context: Context,
  ): Promise<AuthUserResponseV1> {
    return this.usersAuthService.authUserV1(request, context);
  }
}