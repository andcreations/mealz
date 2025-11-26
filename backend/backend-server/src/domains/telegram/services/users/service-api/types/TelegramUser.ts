export class TelegramUser {
  // Entity identifier
  public id: string;

  // User identifier
  public userId: string;

  // Telegram chat (user) identifier
  public chatId: string;

  // Indicates if Telegram is enabled for the user
  public isEnabled: boolean;
}