import { Context } from '@mealz/backend-core';
import {
  RequestController, 
  RequestHandler, 
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  GenerateStartLinkRequestV1,
  GenerateStartLinkResponseV1,
  ReadTelegramUserByChatIdRequestV1,
  ReadTelegramUserByChatIdResponseV1,
  ReadTelegramUserInfoRequestV1,
  ReadTelegramUserInfoResponseV1,
  ReadTelegramUserRequestV1,
  ReadTelegramUserResponseV1,
  TelegramUsersRequestTopics,
  UpsertTelegramUserRequestV1,
  VerifyStartTokenRequestV1,
  VerifyStartTokenResponseV1,
} from '@mealz/backend-telegram-users-service-api';

import { TelegramUsersRequestService } from '../services';

@RequestController()
export class TelegramUsersRequestController {
  public constructor(
    private readonly telegramUsersRequestService: TelegramUsersRequestService,
  ) {}

  @RequestHandler(TelegramUsersRequestTopics.GenerateStartLinkV1)
  public async generateStartLinkV1(
    request: GenerateStartLinkRequestV1,
    context: Context,
  ): Promise<GenerateStartLinkResponseV1> {
    return this.telegramUsersRequestService.generateStartLinkV1(
      request,
      context,
    );
  }

  @RequestHandler(TelegramUsersRequestTopics.VerifyStartTokenV1)
  public async verifyStartTokenV1(
    request: VerifyStartTokenRequestV1,
    context: Context,
  ): Promise<VerifyStartTokenResponseV1> {
    return this.telegramUsersRequestService.verifyStartTokenV1(
      request,
      context,
    );
  }

  @RequestHandler(TelegramUsersRequestTopics.UpsertTelegramUserV1)
  public async upsertTelegramUserV1(
    request: UpsertTelegramUserRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.telegramUsersRequestService.upsertTelegramUserV1(
      request,
      context,
    );
  }

  @RequestHandler(TelegramUsersRequestTopics.ReadTelegramUserV1)
  public async readTelegramUserV1(
    request: ReadTelegramUserRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserResponseV1> {
    return this.telegramUsersRequestService.readTelegramUserV1(
      request,
      context,
    );
  }

  @RequestHandler(TelegramUsersRequestTopics.ReadTelegramUserInfoV1)
  public async readTelegramUserInfoV1(
    request: ReadTelegramUserInfoRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserInfoResponseV1> {
    return this.telegramUsersRequestService.readTelegramUserInfoV1(
      request,
      context,
    );
  }

  @RequestHandler(TelegramUsersRequestTopics.ReadTelegramUserByChatIdV1)
  public async readTelegramUserByChatIdV1(
    request: ReadTelegramUserByChatIdRequestV1,
    context: Context,
  ): Promise<ReadTelegramUserByChatIdResponseV1> {
    return this.telegramUsersRequestService.readTelegramUserByChatIdV1(
      request,
      context,
    );
  }
}