import { RequestControllerClass } from '../types';
import {
  RequestControllerSpecAlreadyExistsError,
  RequestControllerSpecNotFoundError,
} from '../errors';

export interface RequestControllerSpec {
  clazz: RequestControllerClass;
}

const requestControllerSpecs: RequestControllerSpec[] = [];

export function addRequestControllerSpec(
  spec: RequestControllerSpec,
): void {
  const { clazz } = spec;
  const existing = requestControllerSpecs.find(itr => itr.clazz === clazz);
  if (existing) {
    throw new RequestControllerSpecAlreadyExistsError(clazz.constructor.name);
  }
  requestControllerSpecs.push(spec);
}

export function getRequestControllerSpec(
  clazz: RequestControllerClass,
): RequestControllerSpec {
  const existing = requestControllerSpecs.find(itr => itr.clazz === clazz);
  if (!existing) {
    throw new RequestControllerSpecNotFoundError(clazz.constructor.name);
  }
  return existing;
}