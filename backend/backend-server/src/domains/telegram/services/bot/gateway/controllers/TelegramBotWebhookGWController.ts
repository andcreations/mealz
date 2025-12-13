import { Body, Controller, Param, Post } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { GWContext } from '@mealz/backend-gateway-common';
import { TelegramUpdate } from '@andcreations/telegram-bot';
import { UnauthorizedError } from '@mealz/backend-common';

import { TelegramBotWebhookGWService } from '../services';

@Controller('/api/v1/telegram/bot/webhook')
export class TelegramBotWebhookGWController {
  public constructor(
    private readonly telegramBotWebhookGWService: TelegramBotWebhookGWService,
  ) {}

  @Post('/log/:token')
  public async getToken(
    @Param('token') token: string,
    @GWContext() context: Context,
  ): Promise<void> {
    console.log('token', token);
    if (!this.telegramBotWebhookGWService.isTokenValid(token)) {
      throw new UnauthorizedError();
    }
    await this.telegramBotWebhookGWService.logToken(context);
  }

  @Post('/update/:token')
  public async handleUpdate(
    @Param('token') token: string,
    @Body() body: TelegramUpdate,
    @GWContext() context: Context,
  ): Promise<void> {
    if (!this.telegramBotWebhookGWService.isTokenValid(token)) {
      throw new UnauthorizedError();
    }
    await this.telegramBotWebhookGWService.handleUpdate(body, context);
  }
}