import { RequestHandlersInEventControllerError } from '../errors'
import { EventControllerClass } from '../types'
import {
  getEventHandlerSpecs,
  getRequestHandlerSpecs,
  setEventHandlerClassInstance,
  addEventControllerSpec
} from '../spec'

export const EventController = (): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    const controllerClass = target as EventControllerClass
    addEventControllerSpec({
      clazz: controllerClass
    })

    const name = target.name
    const holder: { [key: string]: any } = {}
    holder[name] = class extends controllerClass {
      public constructor(...args: any[]) {
        super(...args)

        const requestHandlerSpecs = getRequestHandlerSpecs(controllerClass)
        if (requestHandlerSpecs.length > 0) {
          throw new RequestHandlersInEventControllerError(
            requestHandlerSpecs.map((spec) => spec.topic)
          )
        }

        const eventHandlerSpecs = getEventHandlerSpecs(controllerClass)
        for (const spec of eventHandlerSpecs) {
          setEventHandlerClassInstance(spec.topic, this)
        }
      }
    }
    return holder[name]
  }
}
