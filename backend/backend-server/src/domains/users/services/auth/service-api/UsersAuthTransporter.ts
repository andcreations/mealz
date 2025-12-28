import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  RequestTransporter, 
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import { USERS_AUTH_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { UsersAuthRequestTopics } from './UsersAuthRequestTopics';
import { 
  AuthUserRequestV1, 
  AuthUserResponseV1, 
  ChangePasswordRequestV1, 
} from './dtos';

export class UsersAuthTransporter {
  public constructor(
    @Inject(USERS_AUTH_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async authUserV1(
    request: AuthUserRequestV1,
    context: Context,
  ): Promise<AuthUserResponseV1> {
    return this.transporter.sendRequest<
      AuthUserRequestV1, AuthUserResponseV1
    >(
      UsersAuthRequestTopics.AuthUserV1,
      request,
      context,
    );
  }

  public async changePasswordV1(
    request: ChangePasswordRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      ChangePasswordRequestV1, VoidTransporterResponse
    >(
      UsersAuthRequestTopics.ChangePasswordV1,
      request, context,
    );
  }
}