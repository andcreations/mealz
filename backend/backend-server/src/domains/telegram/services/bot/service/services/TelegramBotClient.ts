import * as path from 'path';
import * as fs from 'fs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  TelegramBot,
  TelegramMessage,
  TelegramWebhook,
  TelegramWebhookInfo,
  TelegramSendMessageResult,
} from '@andcreations/telegram-bot';
import { Logger } from '@mealz/backend-logger';
import { 
  InternalError, 
  RetryOptions, 
  getStrEnv, 
  requireStrEnv, 
  retry,
} from '@mealz/backend-common';
import { BOOTSTRAP_CONTEXT, Context } from '@mealz/backend-core';
import { isTelegramEnabled } from '@mealz/backend-telegram-common';

import { TelegramBotCommandProvider } from './TelegramBotCommandProvider';

@Injectable()
export class TelegramBotClient implements OnModuleInit {
  private telegramBot: TelegramBot;

  /*
{
  message_id: 273,
  from: {
    id: 8459204007,
    is_bot: true,
    first_name: 'AndCreationsMealzDev',
    username: 'AndCreationsMealzDevBot'
  },
  chat: {
    id: 2086813622,
    first_name: 'Mikołaj',
    username: 'gooceck',
    type: 'private'
  },
  date: 1771352861,
  text: 'This is a test'
}

  */
  public constructor(
    private readonly logger: Logger,
    private readonly commandProvider: TelegramBotCommandProvider,
  ) {
    // setTimeout(async () => {
    //   console.log('-> test');
    //   // const r = await this.telegramBot.sendMessage({
    //   //   chat_id: 2086813622,
    //   //   text: 'This is a test',
    //   // });
    //   // console.log(r);
    //   await this.telegramBot.deleteMessage(2086813622, 273);
    //   console.log('<- test');
    // }, 512)
  }

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

    // commands
    const commandExecutors = await this.commandProvider.getCommandExecutors();
    const commands = commandExecutors
      .filter(commandExecutor => commandExecutor.getAddToCommandList())
      .map(commandExecutor => ({
        command: commandExecutor.getName(),
        description: commandExecutor.getDescription(),
      }));
    const commandNames = commands.map(command => command.command);
    this.logger.info('Setting Telegram bot commands', {
      ...BOOTSTRAP_CONTEXT,
      commandNames,
    });
    this.telegramBot.setCommands(commands);

    // url
    const webhookUrl = requireStrEnv('MEALZ_TELEGRAM_WEBHOOK_URL');

    // set webhook
    const retryOptions: RetryOptions = {
      maxAttempts: 5,
      onRetry: (error, attempt) => {
        this.logger.error(`Failed to set Telegram webhook: ${error.message}`, {
          ...BOOTSTRAP_CONTEXT,
          attempt,
        });
      },
    };
    await retry(
      async () => {
        await this.setWebhook(webhookUrl, certificatePath, BOOTSTRAP_CONTEXT);
      },
      retryOptions,
    );
  }

  private async setWebhook(
    webhookUrl: string,
    certificatePath: string,
    context: Context,
  ): Promise<void> {
    const webhook: TelegramWebhook = {
      url: webhookUrl,
      max_connections: 1,
      certificate: certificatePath,
    };
    await this.telegramBot.setWebhook(webhook);
    this.logger.info('Successfully set Telegram webhook', context);
  }

  public async getWebhook(): Promise<TelegramWebhookInfo> {
    return await this.telegramBot.getWebhookInfo();
  }

  public async sendMessage(
    message: TelegramMessage,
    _context: Context,
  ): Promise<TelegramSendMessageResult> {
    return this.telegramBot.sendMessage(message);
  }
}