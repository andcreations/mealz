import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { USERS_AUTH_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { UsersAuthTopics } from './UsersAuthTopics';
import { AuthUserRequestV1, AuthUserResponseV1 } from './dtos';

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
      UsersAuthTopics.AuthUserV1,
      request,
      context,
    );
  }
}