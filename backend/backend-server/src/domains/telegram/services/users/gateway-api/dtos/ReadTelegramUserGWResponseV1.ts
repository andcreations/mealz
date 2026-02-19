import { GWTelegramUser } from '../types';

export interface ReadTelegramUserGWResponseV1 {
  // Undefined if the user has not linked their Telegram account
  telegramUser?: GWTelegramUser;
}