import { DBFieldType } from '../../core/types';

export const FIELD_TO_COLUMN_MAPPING: Record<DBFieldType, string> = {
  [DBFieldType.STRING]: 'TEXT',
  [DBFieldType.INTEGER]: 'INTEGER',
};

export const COLUMN_TO_FIELD_MAPPING: Record<string, DBFieldType> =
  Object.fromEntries(
    Object.entries(FIELD_TO_COLUMN_MAPPING).map(([field, column]) => {
      return [column, field as DBFieldType];
    }),
  );