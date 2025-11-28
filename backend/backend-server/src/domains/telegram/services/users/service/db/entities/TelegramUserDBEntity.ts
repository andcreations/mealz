import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const TELEGRAM_USER_DB_ENTITY_NAME = 'TelegramUser';
export const TELEGRAM_USER_DB_TABLE_NAME = 'TelegramUsers';

@DBEntity(TELEGRAM_USER_DB_ENTITY_NAME)
export class TelegramUserDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'userId',
    type: DBFieldType.STRING,
  })
  public user_id: string;

  @DBField({
    name: 'chatId',
    type: DBFieldType.STRING,
  })
  public chat_id: string;

  @DBField({
    name: 'isEnabled',
    type: DBFieldType.INTEGER,
  })
  public is_enabled: number;
}