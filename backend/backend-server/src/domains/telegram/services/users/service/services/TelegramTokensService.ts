import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { TimePeriod } from '@andcreations/common';
import { Context } from '@mealz/backend-core';
import {
  TelegramToken,
  TelegramTokenType,
} from '@mealz/backend-telegram-users-common';
import {
  InvalidTokenError,
} from '@mealz/backend-telegram-users-service-api';

import { TelegramTokensRepository } from '../repositories';


@Injectable()
export class TelegramTokensService {
  private static readonly START_TOKEN_PERIOD = TimePeriod.fromStr('1h');

  public constructor(
    private readonly telegramTokenRepository: TelegramTokensRepository,
  ) {}

  public async createToken(
    userId: string,
    type: TelegramTokenType,
    duration: number,
    context: Context,
  ): Promise<UpsertTokenOutput> {
    const token: TelegramToken = {
      userId,
      type,
      token: this.generateToken(),
      expiresAt: Date.now() + duration,
    };
    await this.telegramTokenRepository.upsertToken(token, context);
    return {
      token: token.token,
      expiresAt: token.expiresAt,
    };
  }

  public async createStartToken(
    userId: string,
    context: Context,
  ): Promise<UpsertTokenOutput> {
    return this.createToken(
      userId,
      TelegramTokenType.START,
      TelegramTokensService.START_TOKEN_PERIOD,
      context,
    );
  }

  public async verifyToken(
    token: string,
    type: TelegramTokenType,
    context: Context,
  ): Promise<VerifyTokenOutput> {
    const telegramToken = await this.telegramTokenRepository.readToken(
      token,
      context,
    );
    if (!telegramToken || telegramToken.type !== type) {
      throw new InvalidTokenError();
    }
    if (telegramToken.expiresAt < Date.now()) {
      throw new InvalidTokenError();
    }
    return {
      userId: telegramToken.userId,
    }
  }

  public async verifyStartToken(
    token: string,
    context: Context,
  ): Promise<VerifyTokenOutput> {
    return this.verifyToken(token, TelegramTokenType.START, context);
  }

  private generateToken(): string {
    return v4();
  }
}

export interface UpsertTokenOutput {
  token: string;
  expiresAt: number;
}

export interface VerifyTokenOutput {
  userId: string;
}