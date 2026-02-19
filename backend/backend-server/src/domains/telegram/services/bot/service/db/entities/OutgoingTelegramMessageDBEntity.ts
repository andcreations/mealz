import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const OUTGOING_TELEGRAM_MESSAGE_DB_ENTITY_NAME = 'outgoing_message';
export const OUTGOING_TELEGRAM_MESSAGE_DB_TABLE_NAME = 'outgoing_messages';

@DBEntity(OUTGOING_TELEGRAM_MESSAGE_DB_ENTITY_NAME)
export class OutgoingTelegramMessageDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'user_id',
    type: DBFieldType.STRING,
  })
  public user_id: string;

  @DBField({
    name: 'type_id',
    type: DBFieldType.STRING,
  })
  public type_id: string;

  @DBField({
    name: 'telegram_chat_id',
    type: DBFieldType.INTEGER,
  })
  public telegram_chat_id: number;

  @DBField({
    name: 'telegram_message_id',
    type: DBFieldType.INTEGER,
  })
  public telegram_message_id: number;

  @DBField({
    name: 'content',
    type: DBFieldType.STRING,
  })
  public content: string;

  @DBField({
    name: 'status',
    type: DBFieldType.STRING,
  })
  public status: string;

  @DBField({
    name: 'sent_at',
    type: DBFieldType.INTEGER,
  })
  public sent_at: number;
}
