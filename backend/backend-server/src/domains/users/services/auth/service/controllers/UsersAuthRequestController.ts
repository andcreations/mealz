import { Context } from '@mealz/backend-core';
import { 
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  UsersAuthRequestTopics,
  AuthUserRequestV1,
  AuthUserResponseV1,
  ChangePasswordRequestV1,
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

  @RequestHandler(UsersAuthRequestTopics.ChangePasswordV1)
  public async changePasswordV1(
    request: ChangePasswordRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.usersAuthService.changePasswordV1(request, context);
  }
}