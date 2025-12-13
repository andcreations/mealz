import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { TELEGRAM_USERS_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import {
  GenerateStartLinkRequestV1,
  GenerateStartLinkResponseV1,
  VerifyStartTokenRequestV1,
  VerifyStartTokenResponseV1,
} from './dtos';
import { TelegramUsersRequestTopics } from './TelegramUsersRequestTopics';

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
      TelegramUsersRequestTopics.GenerateStartLinkV1, request, context);
  }

  public async verifyStartTokenV1(
    request: VerifyStartTokenRequestV1,
    context: Context,
  ): Promise<VerifyStartTokenResponseV1> {
    return this.transporter.sendRequest<
      VerifyStartTokenRequestV1, VerifyStartTokenResponseV1
    >(
      TelegramUsersRequestTopics.VerifyStartTokenV1, request, context);
  }
}