import { addRequestHandlerSpec } from '../spec';
import { TransportControllerClass } from '../types';

export const RequestHandler = (
  topic: string,
): PropertyDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
  ): void => {
    if (typeof propertyKey !== 'string') {
      return;
    }

    addRequestHandlerSpec({
      clazz: target.constructor as TransportControllerClass,
      methodName: propertyKey,
      topic,
    });
  }
}