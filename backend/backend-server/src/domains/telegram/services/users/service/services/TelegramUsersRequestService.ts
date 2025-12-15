import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { requireStrEnv } from '@mealz/backend-common';
import {
  TelegramUser,
  GenerateStartLinkRequestV1,
  GenerateStartLinkResponseV1,
  UpsertTelegramUserRequestV1,
  VerifyStartTokenRequestV1,
  VerifyStartTokenResponseV1,
  ReadTelegramUserRequestV1,
  ReadTelegramUserResponseV1,
  ReadTelegramUserInfoResponseV1,
  ReadTelegramUserInfoRequestV1,
} from '@mealz/backend-telegram-users-service-api';

import { InvalidTokenError } from '../errors';
import { TelegramTokensService } from './TelegramTokensService';
import { TelegramUsersService } from './TelegramUsersService';

@Injectable()
export class TelegramUsersRequestService {
  private readonly botName: string;

  public constructor(
    private readonly telegramTokensService: TelegramTokensService,
    private readonly telegramUsersService: TelegramUsersService,
  ) {
    this.botName = requireStrEnv('MEALZ_TELEGRAM_BOT_NAME');
  }

  public async generateStartLinkV1(
    request: GenerateStartLinkRequestV1,
    context: Context,
  ): Promise<GenerateStartLinkResponseV1> {
    // create token
    const { token } = await this.telegramTokensService.createStartToken(
      request.userId,
      context,
    );

    // generate link
    return {
      link: `https://t.me/${this.botName}?start=${token}`,
    };
  }

  public async verifyStartTokenV1(
    request: VerifyStartTokenRequestV1,
    context: Context,
  ): Promise<VerifyStartTokenResponseV1> {
    try {
      const { userId } = await this.telegramTokensService.verifyStartToken(
        request.token,
        context,
      );
      return { userId, isValid: true };
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return { isValid: false };
      }
      throw error;
    }
  }

  public async upsertTelegramUserV1(
    request: UpsertTelegramUserRequestV1,
    context: Context,
  ): Promise<void> {
    const telegramUser: TelegramUser = {
      userId: request.userId,
      telegramChatId: request.telegramChatId,
      telegramUserId: request.telegramUserId,
      telegramUsername: request.telegramUsername,
      isEnabled: true,
    };
    return this.telegramUsersService.upsertTelegramUser(
      telegramUser,
      context,
    );
  }

  public async readTelegramUserV1(
    request: ReadTelegramUserRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserResponseV1> {
    const telegramUser = await this.telegramUsersService.readTelegramUser(
      request.userId,
      context,
    );
    return { telegramUser };
  }

  public async readTelegramUserInfoV1(
    request: ReadTelegramUserInfoRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserInfoResponseV1> {
    const telegramUser = await this.telegramUsersService.readTelegramUser(
      request.userId,
      context,
    );
    return {
      telegramUser,
      canSendMessagesTo: telegramUser?.isEnabled ?? false,
    };
  }
}