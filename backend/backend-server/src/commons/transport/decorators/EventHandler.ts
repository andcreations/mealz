import { addEventHandlerSpec } from '../spec'
import { RequestControllerClass } from '../types'

export const EventHandler = (topic: string): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    if (typeof propertyKey !== 'string') {
      return
    }
    addEventHandlerSpec({
      clazz: target.constructor as RequestControllerClass,
      methodName: propertyKey,
      topic
    })
    return descriptor;
  }
}
