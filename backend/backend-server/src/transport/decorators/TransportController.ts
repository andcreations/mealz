import { TransportControllerClass } from '../types';
import {
  getRequestHandlerSpecs,
  setRequestHandlerClassInstance,
} from '../spec';

export const TransportController = (): ClassDecorator => {
  return (target: Function) => {
    const controllerClass = target as TransportControllerClass;

    const name = target.name;
    const holder: { [key: string]: any } = {};
    holder[name] = class extends controllerClass {
      public constructor(...args: any[]) {
        super(...args);

        const requestHandlerSpecs = getRequestHandlerSpecs(controllerClass);
        for (const spec of requestHandlerSpecs) {
          setRequestHandlerClassInstance(spec.topic, this);
        }
      };
    }
    return holder[name];
  };
}