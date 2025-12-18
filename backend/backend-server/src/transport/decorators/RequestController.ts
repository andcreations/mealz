import { EventHandlersInRequestControllerError } from '../errors';
import { RequestControllerClass } from '../types';
import {
  getEventHandlerSpecs,
  getRequestHandlerSpecs,
  setRequestHandlerClassInstance,
} from '../spec';

export const RequestController = (): ClassDecorator => {
  return (target: Function) => {
    const controllerClass = target as RequestControllerClass;

    const name = target.name;
    const holder: { [key: string]: any } = {};
    holder[name] = class extends controllerClass {
      public constructor(...args: any[]) {
        super(...args);


        const eventHandlerSpecs = getEventHandlerSpecs(controllerClass);
        if (eventHandlerSpecs.length > 0) {
          throw new EventHandlersInRequestControllerError(
            eventHandlerSpecs.map((spec) => spec.topic)
          )
        }

        const requestHandlerSpecs = getRequestHandlerSpecs(controllerClass);
        for (const spec of requestHandlerSpecs) {
          setRequestHandlerClassInstance(spec.topic, this);
        }
      };
    }
    return holder[name];
  };
}