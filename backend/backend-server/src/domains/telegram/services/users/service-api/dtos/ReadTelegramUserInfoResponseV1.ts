import { TelegramUser } from '../types';

export interface ReadTelegramUserInfoResponseV1 {
  // Telegram user, undefined if not found
  telegramUser?: TelegramUser;

  // Indicates if messages can be sent to the user
  canSendMessagesTo: boolean;
}