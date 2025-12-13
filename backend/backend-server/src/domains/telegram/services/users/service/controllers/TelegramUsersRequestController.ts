import { Context } from '@mealz/backend-core';
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import {
  GenerateStartLinkRequestV1,
  GenerateStartLinkResponseV1,
  TelegramUsersRequestTopics,
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
}