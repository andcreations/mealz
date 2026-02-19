import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  RequestTransporter, 
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import { TELEGRAM_USERS_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import {
  GenerateStartLinkRequestV1,
  GenerateStartLinkResponseV1,
  ReadTelegramUserRequestV1,
  ReadTelegramUserResponseV1,
  ReadTelegramUserInfoRequestV1,
  ReadTelegramUserInfoResponseV1,
  UpsertTelegramUserRequestV1,
  VerifyStartTokenRequestV1,
  VerifyStartTokenResponseV1,
  ReadTelegramUserByChatIdRequestV1,
  ReadTelegramUserByChatIdResponseV1,
  PatchTelegramUserRequestV1,
} from './dtos';
import { TelegramUsersRequestTopics } from './TelegramUsersRequestTopics';

@Injectable()
export class TelegramUsersTransporter {
  public constructor(
    @Inject(TELEGRAM_USERS_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async generateStartLinkV1(
    request: GenerateStartLinkRequestV1,
    context: Context,
  ): Promise<GenerateStartLinkResponseV1> {
    return this.transporter.sendRequest<
      GenerateStartLinkRequestV1, GenerateStartLinkResponseV1
    >(
      TelegramUsersRequestTopics.GenerateStartLinkV1,
      request,
      context,
    );
  }

  public async verifyStartTokenV1(
    request: VerifyStartTokenRequestV1,
    context: Context,
  ): Promise<VerifyStartTokenResponseV1> {
    return this.transporter.sendRequest<
      VerifyStartTokenRequestV1, VerifyStartTokenResponseV1
    >(
      TelegramUsersRequestTopics.VerifyStartTokenV1,
      request,
      context,
    );
  }

  public async upsertTelegramUserV1(
    request: UpsertTelegramUserRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      UpsertTelegramUserRequestV1, VoidTransporterResponse
    >(
      TelegramUsersRequestTopics.UpsertTelegramUserV1,
      request,
      context,
    );
  }

  public async readTelegramUserV1(
    request: ReadTelegramUserRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserResponseV1> {
    return this.transporter.sendRequest<
      ReadTelegramUserRequestV1, ReadTelegramUserResponseV1
    >(
      TelegramUsersRequestTopics.ReadTelegramUserV1,
      request,
      context,
    );
  }

  public async readTelegramUserInfoV1(
    request: ReadTelegramUserInfoRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserInfoResponseV1> {
    return this.transporter.sendRequest<
      ReadTelegramUserInfoRequestV1, ReadTelegramUserInfoResponseV1
    >(
      TelegramUsersRequestTopics.ReadTelegramUserInfoV1,
      request,
      context,
    );
  }

  public async readTelegramUserByChatIdV1(
    request: ReadTelegramUserByChatIdRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserByChatIdResponseV1> {
    return this.transporter.sendRequest<
      ReadTelegramUserByChatIdRequestV1, ReadTelegramUserByChatIdResponseV1
    >(
      TelegramUsersRequestTopics.ReadTelegramUserByChatIdV1,
      request,
      context,
    );
  }

  public async patchTelegramUserV1(
    request: PatchTelegramUserRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      PatchTelegramUserRequestV1, VoidTransporterResponse
    >(
      TelegramUsersRequestTopics.PatchTelegramUserV1,
      request,
      context,
    );
  }
}