import { Provider, Type } from '@nestjs/common';

import { TelegramBotCommandExecutor } from '../types';
import { StartBotCommandExecutor } from './StartBotCommandExecutor';
import {
  PlusOneGlassBotCommandExecutor,
} from './PlusOneGlassBotCommandExecutor';

export const TELEGRAM_BOT_COMMAND_TYPES: Type<TelegramBotCommandExecutor>[] = [
  StartBotCommandExecutor,
  PlusOneGlassBotCommandExecutor,
];

export function getTelegramBotCommandProviders(): Provider[] {
  return [
    ...TELEGRAM_BOT_COMMAND_TYPES,
  ];
}