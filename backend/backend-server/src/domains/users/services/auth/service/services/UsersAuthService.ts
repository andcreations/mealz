import { Injectable } from '@nestjs/common';
import * as ms from 'ms';
import * as jwt from 'jsonwebtoken';
import { Context } from '@mealz/backend-core';
import { requireStrEnv } from '@mealz/backend-common';
import { JwtPayload } from '@mealz/backend-gateway-core';
import { AccessForbiddenError } from '@mealz/backend-gateway-common';
import {
  AuthUserRequestV1,
  AuthUserResponseV1,
  CheckUserAuthRequestV1,
  CheckUserAuthResponseV1,
} from '@mealz/backend-users-auth-service-api';

import { InvalidEmailOrPasswordError } from '../errors';
import { comparePassword } from '../utils';
import { UsersAuthRepository } from '../repositories';

@Injectable()
export class UsersAuthService {
  private static readonly ACCESS_TOKEN_PERIOD = '365h';

  private readonly jwtSecret: string;
  private readonly jwtAccessTokenPeriod: number;

  public constructor(
    private readonly usersAuthRepository: UsersAuthRepository,
  ) {
    this.jwtSecret = requireStrEnv('MEALZ_JWT_SECRET');
    this.jwtAccessTokenPeriod = this.toSeconds(
      ms(UsersAuthService.ACCESS_TOKEN_PERIOD),
    );
  }

  public async authUserV1(
    request: AuthUserRequestV1,
    context: Context,
  ): Promise<AuthUserResponseV1> {
    // read user
    const user = await this.usersAuthRepository.findUserByEmailForAuth(
      request.email,
      context,
    );
    if (!user) {
      throw new InvalidEmailOrPasswordError();
    }

    // check password
    if (!comparePassword(request.password, user.password)) {
      throw new InvalidEmailOrPasswordError();
    }

    // payload
    const issuedAt = this.toSeconds(Date.now());
    const payload: JwtPayload = {
      user: {
        id: user.id,
        roles: user.roles || [],
      },
      iat: issuedAt,
      exp: issuedAt + this.jwtAccessTokenPeriod,
    };

    // generate access token
    const accessToken = jwt.sign(
      payload,
      this.jwtSecret,
      {
        // expiresIn: UsersAuthService.ACCESS_TOKEN_PERIOD,
      },
    );

    return {
      userId: user.id,
      accessToken,
    };
  }


  public async checkUserAuthV1(
    request: CheckUserAuthRequestV1,
  ): Promise<CheckUserAuthResponseV1> {
    const { accessToken } = request;
    if (!accessToken) {
      throw new AccessForbiddenError();
    }

    // verify
    let rawPayload: jwt.JwtPayload | string;
    try {
      rawPayload = jwt.verify(accessToken, this.jwtSecret);
    } catch (error) {
      throw new AccessForbiddenError();
    }
    if (typeof rawPayload === 'string') {
      throw new AccessForbiddenError();
    }    

    // payload
    const payload = rawPayload as JwtPayload;

    return {
      userId: payload.user.id,
    };
  }

  private toSeconds(milliseconds: number): number {
    return Math.round(milliseconds / 1000);
  }
}
