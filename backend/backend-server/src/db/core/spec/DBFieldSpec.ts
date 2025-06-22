import { DBFieldOptions } from '../decorators';
import { DBFieldSpecAlreadyExistsError } from '../errors';
import { DBEntityClass } from '../types';

export interface DBFieldSpec extends DBFieldOptions {
  clazz: DBEntityClass;
}

const fieldSpecs: DBFieldSpec[] = [];

export function addDBFieldSpec(
  spec: DBFieldSpec,
): void {
  const existing = fieldSpecs.find(itr => {
    return itr.clazz === spec.clazz && itr.name === spec.name;
  });
  if (existing) {
    throw new DBFieldSpecAlreadyExistsError(
      spec.clazz.constructor.name,
      spec.name,
    );
  }
  fieldSpecs.push(spec);
}

export function getDBFieldSpec(
  clazz: DBEntityClass,
): DBFieldSpec[] {
  return fieldSpecs.filter(itr => itr.clazz === clazz);
}