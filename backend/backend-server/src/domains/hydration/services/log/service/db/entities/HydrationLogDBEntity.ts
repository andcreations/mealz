import { DBEntity, DBField, DBFieldType } from '@mealz/backend-db';

export const HYDRATION_LOG_DB_ENTITY_NAME = 'hydration_log';
export const HYDRATION_LOG_DB_TABLE_NAME = 'hydration_logs';

@DBEntity(HYDRATION_LOG_DB_ENTITY_NAME)
export class HydrationLogDBEntity {
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
    name: 'createdAt',
    type: DBFieldType.INTEGER,
  })
  public createdAt: number;
}