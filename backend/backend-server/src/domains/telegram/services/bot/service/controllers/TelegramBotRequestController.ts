import { Context } from '@mealz/backend-core';
import { 
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  HandleUpdateRequestV1,
  LogWebhookTokenRequestV1,
  SendMessageToUserRequestV1,
  TelegramBotRequestTopics,
} from '@mealz/backend-telegram-bot-service-api';

import { TelegramBotService } from '../services';

@RequestController()
export class TelegramBotRequestController {
  public constructor(
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @RequestHandler(TelegramBotRequestTopics.LogWebhookTokenV1)
  public async logWebhookTokenV1(
    _request: LogWebhookTokenRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.telegramBotService.logWebhookTokenV1(context);
  }

  @RequestHandler(TelegramBotRequestTopics.HandleUpdateV1)
  public async handleUpdateV1(
    request: HandleUpdateRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.telegramBotService.handleUpdateV1(request, context);
  }

  @RequestHandler(TelegramBotRequestTopics.SendMessageToUserV1)
  public async sendMessageToUserV1(
    request: SendMessageToUserRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.telegramBotService.sendMessageToUserV1(request, context);
  }
}