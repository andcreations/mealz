import {
  DBEntitySpecNotFoundError,
  DBEntitySpecAlreadyExistsError,
} from '../errors';
import { DBEntityClass } from '../types';
import { DBFieldSpec } from './DBFieldSpec';

export interface DBEntitySpec {
  name: string;
  clazz: DBEntityClass;
  fields: DBFieldSpec[];
}

const entitySpecs: DBEntitySpec[] = [];

export function addDBEntitySpec(
  spec: Pick<DBEntitySpec,
    | 'name'
    | 'clazz'
  >
): void {
  const existing = entitySpecs.find(itr => itr.name === spec.name);
  if (existing) {
    throw new DBEntitySpecAlreadyExistsError(spec.name);
  }
  entitySpecs.push({
    ...spec,
    fields: [],
  });
}

export function getDBEntitySpec(name: string): DBEntitySpec {
  const existing = entitySpecs.find(itr => itr.name === name);
  if (!existing) {
    throw new DBEntitySpecNotFoundError(name);
  }
  return existing;
}
