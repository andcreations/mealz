import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TimePeriod } from '@andcreations/common';
import { Context } from '@mealz/backend-core';
import {
  GenerateStartLinkRequestV1,
  GenerateStartLinkResponseV1,
  VerifyStartTokenRequestV1,
  VerifyStartTokenResponseV1,
} from '@mealz/backend-telegram-users-service-api';
import { requireStrEnv } from '@mealz/backend-common';

import { StartJwtPayload, StartJwtPayloadUser } from '../types';
import { InvalidStartTokenError } from '../errors';

@Injectable()
export class TelegramUsersRequestService {
  private static readonly TOKEN_PERIOD = TimePeriod.fromStr('1h');

  private readonly botName: string;
  private readonly jwtSecret: string;
  private readonly tokenPeriod: number = this.toSeconds(
    TelegramUsersRequestService.TOKEN_PERIOD
  );

  public constructor() {
    this.botName = requireStrEnv('MEALZ_TELEGRAM_BOT_NAME');
    this.jwtSecret = requireStrEnv('MEALZ_TELEGRAM_JWT_SECRET');
  }

  public async generateStartLinkV1(
    request: GenerateStartLinkRequestV1,
    _context: Context,
  ): Promise<GenerateStartLinkResponseV1> {
    // payload
    const issuedAt = this.toSeconds(Date.now());
    const payload: StartJwtPayload = {
      user: {
        userId: request.userId,
      },
      iat: issuedAt,
      exp: issuedAt + this.tokenPeriod,
    };

    // generate token
    const token = jwt.sign(payload, this.jwtSecret);

    // generate link
    return {
      link: `https://t.me/${this.botName}?start=${token}`,
    };
  }

  private verifyToken(token: string): StartJwtPayloadUser {
    // verify
    let rawPayload: jwt.JwtPayload | string;
    try {
      rawPayload = jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new InvalidStartTokenError();
    }
    if (typeof rawPayload === 'string') {
      throw new InvalidStartTokenError();
    }

    // payload
    const payload = rawPayload as StartJwtPayload;
    if (payload.exp < this.toSeconds(Date.now())) {
      throw new InvalidStartTokenError();
    }
    return payload.user;
  }

  public async verifyStartTokenV1(
    request: VerifyStartTokenRequestV1,
    _context: Context,
  ): Promise<VerifyStartTokenResponseV1> {
    const user = this.verifyToken(request.token);
    return {
      userId: user.userId,
    };
  }

  private toSeconds(milliseconds: number): number {
    return Math.round(milliseconds / 1000);
  }  
}