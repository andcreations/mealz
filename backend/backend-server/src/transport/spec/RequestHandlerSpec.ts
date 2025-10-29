import { Context } from '@mealz/backend-core';

import { TransportControllerClass } from '../types';
import {
  RequestHandlerSpecAlreadyExistsError,
  RequestHandlerSpecNotFoundError,
  DuplicatedTransportHandlerError,
  RequestHandlerNotFoundError,
} from '../errors';

export interface RequestHandlerSpec {
  clazz: TransportControllerClass;
  topic: string;
  methodName: string;
  classInstance?: object;
}

const requestHandlerSpecs: RequestHandlerSpec[] = [];

export function addRequestHandlerSpec(
  spec: RequestHandlerSpec,
): void {
  const { clazz, topic } = spec;
  const existing = requestHandlerSpecs.find(itr => itr.topic === topic);
  if (existing) {
    throw new RequestHandlerSpecAlreadyExistsError(clazz.name, topic);
  }
  requestHandlerSpecs.push(spec);
}

export function getRequestHandlerSpecs(
  clazz: TransportControllerClass,
): RequestHandlerSpec[] {
  return requestHandlerSpecs.filter(itr => itr.clazz === clazz);
}

export function setRequestHandlerClassInstance(
  topic: string,
  classInstance: object,
): void {
  const spec = requestHandlerSpecs.find(itr => itr.topic === topic);
  if (!spec) {
    throw new RequestHandlerSpecNotFoundError(topic);
  }
  if (spec.classInstance) {
    throw new DuplicatedTransportHandlerError(topic);
  }
  spec.classInstance = classInstance;
}

export function callRequestHandler<TRequest, TResponse>(
  topic: string,
  request: TRequest,
  context: Context,
): Promise<TResponse> {
  const spec = requestHandlerSpecs.find(itr => itr.topic === topic);
  if (!spec) {
    throw new RequestHandlerSpecNotFoundError(topic);
  }
  const { classInstance, methodName } = spec;
  if (!classInstance) {
    throw new RequestHandlerNotFoundError(topic);
  }
  return classInstance[methodName](request, context);
}