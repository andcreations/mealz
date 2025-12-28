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
import { InternalError, getStrEnv, requireStrEnv } from '@mealz/backend-common';
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
    
    // path to the self-signed CA certificate
    let certificatePath = getStrEnv('MEALZ_TELEGRAM_WEBHOOK_CERTIFICATE');
    if (certificatePath) {
      certificatePath = path.resolve(certificatePath);
      if (!fs.existsSync(certificatePath)) {
        throw new InternalError(
          `Telegram webhook certificate file ${certificatePath} not found`,
        );
      }
      this.logger.info(
        'Using Telegram webhook certificate',
        BOOTSTRAP_CONTEXT,
      );
    }
    else {
      this.logger.info(
        'Skipping Telegram webhook certificate',
        BOOTSTRAP_CONTEXT,
      ); 
    }

    // set webhook
    this.logger.info('Setting Telegram webhook', BOOTSTRAP_CONTEXT);
    const webhook: TelegramWebhook = {
      url: requireStrEnv('MEALZ_TELEGRAM_WEBHOOK_URL'),
      max_connections: 1,
      certificate: certificatePath,
    };
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