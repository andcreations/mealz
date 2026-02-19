import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  TelegramUserNotFoundError,
  GenerateStartLinkRequestV1,
  ReadTelegramUserRequestV1,
  TelegramUser,
  TelegramUsersTransporter,
  PatchTelegramUserRequestV1,
} from '@mealz/backend-telegram-users-service-api';

import {
  GenerateStartLinkGWResponseV1Impl,
  ReadTelegramUserGWResponseV1Impl,
  PatchTelegramUserGWRequestV1Impl,
} from '../dtos';
import { GWTelegramUserMapper } from './GWTelegramUserMapper';

@Injectable()
export class TelegramUsersGWService {
  public constructor(
    private readonly gwTelegramUserMapper: GWTelegramUserMapper,
    private readonly telegramUsersTransporter: TelegramUsersTransporter,
  ) {}

  public async generateStartLinkV1(
    userId: string,
    context: Context,
  ): Promise<GenerateStartLinkGWResponseV1Impl> {
    const request: GenerateStartLinkRequestV1 = {
      userId,
    };
    const response = await this.telegramUsersTransporter.generateStartLinkV1(
      request,
      context,
    );
    return {
      link: response.link,
    };
  }

  public async readTelegramUserV1(
    userId: string,
    context: Context,
  ): Promise<ReadTelegramUserGWResponseV1Impl> {
    const request: ReadTelegramUserRequestV1 = {
      userId,
    };
    let telegramUser: TelegramUser;
    try {
      const response = await this.telegramUsersTransporter.readTelegramUserV1(
        request,
        context,
      );
      telegramUser = response.telegramUser;
    } catch (error) {
      if (error instanceof TelegramUserNotFoundError) {
        telegramUser = undefined;
      } else {
        throw error;
      }
    }
    return {
      telegramUser: this.gwTelegramUserMapper.fromTelegramUser(telegramUser),
    };
  }

  public async patchTelegramUserV1(
    userId: string,
    gwRequest: PatchTelegramUserGWRequestV1Impl,
    context: Context,
  ): Promise<void> {
    const request: PatchTelegramUserRequestV1 = {
      userId,
      isEnabled: gwRequest.isEnabled,
    };
    await this.telegramUsersTransporter.patchTelegramUserV1(
      request,
      context,
    );
  }
}