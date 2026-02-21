import { UpsertObject } from '@mealz/backend-db';
import { UserProperties } from './UserProperties';

export type UserPropertiesForUpsert<T = any> =
  UpsertObject<UserProperties<T>, 'id', 'modifiedAt'>