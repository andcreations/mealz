import {
  ReadTelegramUserGWResponseV1,
} from '@mealz/backend-telegram-users-gateway-api';

import { GWTelegramUserImpl } from '../types';

export class ReadTelegramUserGWResponseV1Impl
  implements ReadTelegramUserGWResponseV1
{
  // Undefined if the user has not linked their Telegram account
  telegramUser?: GWTelegramUserImpl;
}