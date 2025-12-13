import { Injectable } from '@nestjs/common';
import { TelegramUpdate } from '@andcreations/telegram-bot';
import { Context } from '@mealz/backend-core';
import { requireStrEnv } from '@mealz/backend-common';
import {
  TelegramBotTransporter,
} from '@mealz/backend-telegram-bot-service-api';

@Injectable()
export class TelegramBotWebhookGWService {
  private readonly token: string;

  public constructor(
    private readonly telegramBotTransporter: TelegramBotTransporter
  ) {
    this.token = requireStrEnv('MEALZ_TELEGRAM_WEBHOOK_TOKEN');
  }

  public isTokenValid(token: string): boolean {
    return token === this.token;
  }

  public async logToken(context: Context): Promise<void> {
    await this.telegramBotTransporter.logWebhookTokenV1({}, context);
  }

  public async handleUpdate(
    update: TelegramUpdate,
    context: Context
  ): Promise<void> {
    await this.telegramBotTransporter.handleUpdateV1({ update }, context);
  }
}