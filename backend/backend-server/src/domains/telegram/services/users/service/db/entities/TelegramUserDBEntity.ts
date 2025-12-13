import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const TELEGRAM_USER_DB_ENTITY_NAME = 'telegram_user';
export const TELEGRAM_USER_DB_TABLE_NAME = 'telegram_users';

@DBEntity(TELEGRAM_USER_DB_ENTITY_NAME)
export class TelegramUserDBEntity {
  @DBField({
    name: 'user_id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public user_id: string;

  @DBField({
    name: 'telegram_chat_id',
    type: DBFieldType.INTEGER,
  })
  public telegram_chat_id: number;

  @DBField({
    name: 'telegram_user_id',
    type: DBFieldType.INTEGER,
  })
  public telegram_user_id: number;

  @DBField({
    name: 'telegram_username',
    type: DBFieldType.STRING,
  })
  public telegram_username: string;

  @DBField({
    name: 'is_enabled',
    type: DBFieldType.INTEGER,
  })
  public is_enabled: number;
}