import { trace } from '@opentelemetry/api';
import { Context } from '@mealz/backend-core';
import { withActiveSpan } from '@mealz/backend-tracing';

import { RequestControllerClass } from '../types';
import {
  RequestHandlerSpecAlreadyExistsError,
  RequestHandlerSpecNotFoundError,
  DuplicatedRequestHandlerError,
  RequestHandlerNotFoundError,
} from '../errors';

export interface RequestHandlerSpec {
  clazz: RequestControllerClass;
  topic: string;
  methodName: string;
  classInstance?: object;
}

const tracer = trace.getTracer('request-handler');
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
  clazz: RequestControllerClass,
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
    throw new DuplicatedRequestHandlerError(topic);
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

  return withActiveSpan(
    tracer,
    `local-transporter REQUEST ${topic}`,
    async (span) => {
      span.setAttribute('request.topic', topic);
      span.setAttribute('handler.class', spec.clazz.name);
      span.setAttribute('handler.method', methodName);
      try {
        return await classInstance[methodName](request, context);
      } catch (error) {
        span.error(error);
        throw error;
      } finally {
        span.end();
      }
    },
  );
}