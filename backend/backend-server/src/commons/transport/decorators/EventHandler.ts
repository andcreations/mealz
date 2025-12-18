import { addEventHandlerSpec } from '../spec'
import { RequestControllerClass } from '../types'

export const EventHandler = (topic: string): PropertyDecorator => {
  return (target: unknown, propertyKey: string | symbol): void => {
    if (typeof propertyKey !== 'string') {
      return
    }

    addEventHandlerSpec({
      clazz: target.constructor as RequestControllerClass,
      methodName: propertyKey,
      topic
    })
  }
}
