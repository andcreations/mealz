import { addRequestHandlerSpec } from '../spec';
import { RequestControllerClass } from '../types';

export const RequestHandler = (topic: string): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    if (typeof propertyKey !== 'string') {
      return;
    }
    addRequestHandlerSpec({
      clazz: target.constructor as RequestControllerClass,
      methodName: propertyKey,
      topic,
    });
    return descriptor;
  }
}