import * as path from 'path';
import * as fs from 'fs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  TelegramBot,
  TelegramMessage,
  TelegramWebhook,
  TelegramWebhookInfo,
} from '@andcreations/telegram-bot';
import { Logger } from '@mealz/backend-logger';
import { InternalError, requireStrEnv } from '@mealz/backend-common';
import { BOOTSTRAP_CONTEXT, Context } from '@mealz/backend-core';
import { isTelegramEnabled } from '@mealz/backend-telegram-common';

@Injectable()
export class TelegramBotClient implements OnModuleInit {
  private telegramBot: TelegramBot;

  public constructor(private readonly logger: Logger) {}

  public async onModuleInit(): Promise<void> {
    if (!isTelegramEnabled()) {
      this.logger.info('Telegram disabled', BOOTSTRAP_CONTEXT);
      return;
    }
    const botToken = requireStrEnv('MEALZ_TELEGRAM_BOT_TOKEN');
    this.telegramBot = new TelegramBot(botToken);
    
    const certificate = path.resolve(
      requireStrEnv('MEALZ_TELEGRAM_WEBHOOK_CERTIFICATE')
    );
    if (!fs.existsSync(certificate)) {
      throw new InternalError(
        `Telegram webhook certificate file ${certificate} not found`,
      );
    }
    // set webhook
    const webhook: TelegramWebhook = {
      url: requireStrEnv('MEALZ_TELEGRAM_WEBHOOK_URL'),
      max_connections: 1,
      certificate,
    };
    this.logger.info('Setting Telegram webhook', {
      ...BOOTSTRAP_CONTEXT,
      webhook,
    });
    await this.telegramBot.setWebhook(webhook);
  }

  public async getWebhook(): Promise<TelegramWebhookInfo> {
    return await this.telegramBot.getWebhookInfo();
  }

  public async sendMessage(
    message: TelegramMessage,
    _context: Context,
  ): Promise<void> {
    await this.telegramBot.sendMessage(message);
  }
}