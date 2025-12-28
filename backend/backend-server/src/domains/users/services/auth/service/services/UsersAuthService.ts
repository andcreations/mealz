import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TimePeriod } from '@andcreations/common';
import { Context } from '@mealz/backend-core';
import { requireStrEnv } from '@mealz/backend-common';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { JwtPayload } from '@mealz/backend-gateway-core';
import {
  AuthUserRequestV1,
  AuthUserResponseV1,
  ChangePasswordRequestV1,
} from '@mealz/backend-users-auth-service-api';

import { InvalidEmailOrPasswordError, InvalidPasswordError } from '../errors';
import { comparePassword, hashPassword } from '../utils';
import { UsersAuthRepository } from '../repositories';

@Injectable()
export class UsersAuthService {
  private static readonly ACCESS_TOKEN_PERIOD = '365d';

  private readonly jwtSecret: string;
  private readonly jwtAccessTokenPeriod: number;

  public constructor(
    private readonly usersAuthRepository: UsersAuthRepository,
  ) {
    this.jwtSecret = requireStrEnv('MEALZ_JWT_SECRET');
    this.jwtAccessTokenPeriod = this.toSeconds(
      TimePeriod.fromStr(UsersAuthService.ACCESS_TOKEN_PERIOD)
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

  public async changePasswordV1(
    request: ChangePasswordRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const password = await this.usersAuthRepository.readPasswordByUserId(
      request.userId,
      context,
    );
    if (!password || !comparePassword(request.oldPassword, password)) {
      throw new InvalidPasswordError();
    }

    // hash new password
    const hashedPassword = hashPassword(request.newPassword);

    // update password
    await this.usersAuthRepository.updatePasswordByUserId(
      request.userId, hashedPassword, context);
    
    return {};
  }

  private toSeconds(milliseconds: number): number {
    return Math.round(milliseconds / 1000);
  }
}
