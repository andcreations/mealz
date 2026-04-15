import { Injectable } from '@nestjs/common';
import { TelegramUpdate } from '@andcreations/telegram-bot';
import { Context } from '@mealz/backend-core';
import { Logger } from '@mealz/backend-logger';
import { isTelegramEnabled } from '@mealz/backend-telegram-common';
import {
  ActionsManagerTransporter,
} from '@mealz/backend-actions-manager-service-api';
import { 
  getActionIdFromCallbackData,
  isActionCallbackData,
} from '@mealz/backend-telegram-bot-service-api';

import { TelegramBotCommand } from '../types';
import { TelegramBotCommandProvider } from './TelegramBotCommandProvider';

@Injectable()
export class TelegramBotUpdateService {
  public constructor(
    private readonly logger: Logger,
    private readonly actionsManagerTransporter: ActionsManagerTransporter,
    private readonly telegramBotCommandProvider: TelegramBotCommandProvider,
  ) {}

  public async handleUpdateV1(
    update: TelegramUpdate,
    context: Context,
  ): Promise<void> {
    if (!isTelegramEnabled()) {
      return;
    }
    this.logger.debug('Handling Telegram bot update', {
      ...context,
      update: JSON.stringify(update),
    });
    if (update.message) {
      await this.handleMessage(update, context);
      return;
    }
    if (update.callback_query) {
      await this.handleCallbackQuery(update, context);
      return;
    }
    this.logger.error('Unknown Telegram bot update', {
      ...context,
      update: JSON.stringify(update),
    });
  }

  private async handleMessage(
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

  private async handleCallbackQuery(
    update: TelegramUpdate,
    context: Context,
  ): Promise<void> {
    const callbackQuery = update.callback_query;
    const data = callbackQuery.data;

    // run action
    if (isActionCallbackData(data)) {
      const actionId = getActionIdFromCallbackData(data);
      try {
        await this.actionsManagerTransporter.runActionV1(
          { actionId },
          context,
        );
      } catch (error) {
        this.logger.error(
          'Error running Telegram bot action',
          {
            ...context,
            actionId,
          },
          error,
        );
      }
      return;
    }

    // unknown callback query
    this.logger.error(
      'Unknown Telegram bot callback query',
      {
        ...context,
        callbackQuery: JSON.stringify(callbackQuery),
      },
    );
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