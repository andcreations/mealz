import { TransportControllerClass } from '../types';
import {
  TransportControllerSpecAlreadyExistsError,
  TransportControllerSpecNotFoundError,
} from '../errors';

export interface TransportControllerSpec {
  clazz: TransportControllerClass;l
}

const transportControllerSpecs: TransportControllerSpec[] = [];

export function addTransportControllerSpec(
  spec: TransportControllerSpec,
): void {
  const { clazz } = spec;
  const existing = transportControllerSpecs.find(itr => itr.clazz === clazz);
  if (existing) {
    throw new TransportControllerSpecAlreadyExistsError(clazz.constructor.name);
  }
  transportControllerSpecs.push(spec);
}

export function getTransportControllerSpec(
  clazz: TransportControllerClass,
): TransportControllerSpec {
  const existing = transportControllerSpecs.find(itr => itr.clazz === clazz);
  if (!existing) {
    throw new TransportControllerSpecNotFoundError(clazz.constructor.name);
  }
  return existing;
}