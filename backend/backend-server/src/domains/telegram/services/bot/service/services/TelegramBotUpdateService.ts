import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TelegramUpdate } from '@andcreations/telegram-bot';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';

import { TelegramBotCommand } from '../types';
import { TelegramBotClient } from './TelegramBotClient';
import { TelegramBotCommandProvider } from './TelegramBotCommandProvider';

@Injectable()
export class TelegramBotUpdateService implements OnModuleInit, OnModuleDestroy {
  public constructor(
    private readonly logger: Logger,
    private readonly telegramBotClient: TelegramBotClient,
    private readonly telegramBotCommandProvider: TelegramBotCommandProvider,
  ) {}

  public onModuleInit(): void {
  }

  public onModuleDestroy(): void {
  }
  
  public async handleUpdateV1(
    update: TelegramUpdate,
    context: Context,
  ): Promise<void> {
    const message = update.message.text;
    if (this.isBotCommand(message)) {
      // parse
      const command = this.parseMessageIntoCommand(update);

      // find executor
      const executor = this.telegramBotCommandProvider.getCommandExecutor(
        command.command,
      );
      if (!executor) {
        this.logger.error('Telegram bot command executor not found', {
          ...context,
          command,
          update: JSON.stringify(update),
        });
        return;
      }

      // execute
      this.logger.debug('Executing Telegram bot command', {
        ...context,
        command,
      });
      try {
        await executor.execute(command, context);
      } catch (error) {
        console.log(error);
        this.logger.error(
          'Error executing Telegram bot command',
          {
            ...context,
            command,
          },
          error,
        );
      }
    }
  }

  private isBotCommand(message: string): boolean {
    return message.startsWith('/');
  }

  private parseMessageIntoCommand(update: TelegramUpdate): TelegramBotCommand {
    const values = update.message.text.split(' ');  
    return {
      command: values[0].substring(1), // remove the leading '/'
      args: values.slice(1),
      update,
    };
  }  
}