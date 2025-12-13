import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const TELEGRAM_TOKEN_DB_ENTITY_NAME = 'telegram_token';
export const TELEGRAM_TOKEN_DB_TABLE_NAME = 'telegram_tokens';

@DBEntity(TELEGRAM_TOKEN_DB_ENTITY_NAME)
export class TelegramTokenDBEntity {
  @DBField({
    name: 'user_id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public user_id: string;

  @DBField({
    name: 'type',
    type: DBFieldType.STRING,
  })
  public type: string;

  @DBField({
    name: 'token',
    type: DBFieldType.STRING,
  })
  public token: string;

  @DBField({
    name: 'expires_at',
    type: DBFieldType.INTEGER,
  })
  public expires_at: number;
}