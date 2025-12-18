import { DBFieldSpec } from '../spec';

export function getDBEntityPrimaryKeyAsString(
  fieldsSpec: DBFieldSpec[],
  entity: any,
): string {
  const values: string[] = [];
  fieldsSpec.forEach(field => {
    if (field.primaryKey) {
      values.push(entity[field.name]);
    }
  });
  return values.join(',');
}