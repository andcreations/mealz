import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const ACTION_DB_ENTITY_NAME = 'action';
export const ACTION_DB_TABLE_NAME = 'actions';

@DBEntity(ACTION_DB_ENTITY_NAME)
export class ActionDBEntity {
  @DBField({
    name: 'id',
    type: DBFieldType.STRING,
    primaryKey: true,
  })
  public id: string;

  @DBField({
    name: 'topic',
    type: DBFieldType.STRING,
  })
  public topic: string;

  @DBField({
    name: 'payload',
    type: DBFieldType.BINARY,
  })
  public payload: Buffer;

  @DBField({
    name: 'status',
    type: DBFieldType.STRING,
  })
  public status: string;

  @DBField({
    name: 'error',
    type: DBFieldType.STRING,
  })
  public error: string;

  @DBField({
    name: 'created_at',
    type: DBFieldType.INTEGER,
  })
  public created_at: number;


  @DBField({
    name: 'executed_at',
    type: DBFieldType.INTEGER,
  })
  public executed_at: number;
}