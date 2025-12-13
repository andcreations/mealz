import { Provider, Type } from '@nestjs/common';

import { TelegramBotCommandExecutor } from '../types';
import { StartBotCommandExecutor } from './StartBotCommandExecutor';

export const TELEGRAM_BOT_COMMAND_TYPES: Type<TelegramBotCommandExecutor>[] = [
  StartBotCommandExecutor,
];

export function getTelegramBotCommandProviders(): Provider[] {
  return [
    ...TELEGRAM_BOT_COMMAND_TYPES,
  ];
}