export class TelegramUser {
  // User identifier
  public userId: string;

  // Telegram chat (user) identifier
  public telegramChatId: number;

  // Telegram user (chat) identifier
  public telegramUserId: number;

  // Telegram username
  public telegramUsername: string;

  // Indicates if Telegram is enabled for the user
  public isEnabled: boolean;
}