import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  AuthUserRequestV1,
  UsersAuthTransporter,
} from '@mealz/backend-users-auth-service-api';
import { UserAuthGWRequestV1 } from '@mealz/backend-users-auth-gateway-api';

import { UserAuthGWResponseV1Impl } from '../dtos';

@Injectable()
export class UserAuthGWService {
  constructor(
    private readonly usersAuthTransporter: UsersAuthTransporter,
  ) {}

  public async userAuth(
    gwRequest: UserAuthGWRequestV1,
    context: Context,
  ): Promise<UserAuthGWResponseV1Impl> {
    const request: AuthUserRequestV1 = {
      email: gwRequest.email,
      password: gwRequest.password,
    };
    const response = await this.usersAuthTransporter.authUserV1(
      request,
      context,
    );
    return {
      userId: response.userId,
      accessToken: response.accessToken,
    };
  }
}