import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { TELEGRAM_BOT_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { TelegramBotRequestTopics } from './TelegramBotRequestTopics';
import { HandleUpdateRequestV1, LogWebhookTokenRequestV1 } from './dtos';

export class TelegramBotTransporter {
  public constructor(
    @Inject(TELEGRAM_BOT_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async logWebhookTokenV1(
    request: LogWebhookTokenRequestV1,
    context: Context,
  ): Promise<void> {
    return this.transporter.sendRequest<
      LogWebhookTokenRequestV1, void
    >(
      TelegramBotRequestTopics.LogWebhookTokenV1,
      request,
      context,
    );
  }

  public async handleUpdateV1(
    request: HandleUpdateRequestV1,
    context: Context,
  ): Promise<void> {
    return this.transporter.sendRequest<
      HandleUpdateRequestV1, void
    >(
      TelegramBotRequestTopics.HandleUpdateV1,
      request,
      context,
    );
  }
}