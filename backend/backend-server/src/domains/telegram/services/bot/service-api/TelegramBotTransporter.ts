import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  RequestTransporter, 
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import { TELEGRAM_BOT_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { TelegramBotRequestTopics } from './TelegramBotRequestTopics';
import { 
  HandleUpdateRequestV1, 
  LogWebhookTokenRequestV1, 
  DeleteMessagesByUserIdAndTypeIdRequestV1,
  SendMessageToUserRequestV1,
} from './dtos';

export class TelegramBotTransporter {
  public constructor(
    @Inject(TELEGRAM_BOT_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async logWebhookTokenV1(
    request: LogWebhookTokenRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      LogWebhookTokenRequestV1, VoidTransporterResponse
    >(
      TelegramBotRequestTopics.LogWebhookTokenV1,
      request,
      context,
    );
  }

  public async handleUpdateV1(
    request: HandleUpdateRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      HandleUpdateRequestV1, VoidTransporterResponse
    >(
      TelegramBotRequestTopics.HandleUpdateV1,
      request,
      context,
    );
  }

  public async sendMessageToUserV1(
    request: SendMessageToUserRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      SendMessageToUserRequestV1, VoidTransporterResponse
    >(
      TelegramBotRequestTopics.SendMessageToUserV1,
      request,
      context,
    );
  }

  public async deleteMessagesByUserIdAndTypeIdV1(
    request: DeleteMessagesByUserIdAndTypeIdRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      DeleteMessagesByUserIdAndTypeIdRequestV1, VoidTransporterResponse
    >(
      TelegramBotRequestTopics.DeleteMessagesByUserIdAndTypeIdV1,
      request,
      context,
    );
  }
}