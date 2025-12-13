import { TelegramTokenType } from './TelegramTokenType';

export interface TelegramToken {
  // User identifier
  userId: string;

  // Token type
  type: TelegramTokenType;

  // Token
  token: string;

  // Token expiration time (milliseconds since epoch)
  expiresAt: number;
}