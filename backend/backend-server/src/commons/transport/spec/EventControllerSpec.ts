import {
  EventControllerSpecAlreadyExistsError,
  EventControllerSpecNotFoundError
} from '../errors'
import { EventControllerClass, RequestControllerClass } from '../types'

export interface EventControllerSpec {
  clazz: EventControllerClass
}

const eventControllerSpecs: EventControllerSpec[] = []

export function addEventControllerSpec(spec: EventControllerSpec): void {
  const { clazz } = spec
  const existing = eventControllerSpecs.find((itr) => itr.clazz === clazz)
  if (existing) {
    throw new EventControllerSpecAlreadyExistsError(clazz.constructor.name)
  }
  eventControllerSpecs.push(spec)
}

export function getEventControllerSpec(
  clazz: RequestControllerClass
): EventControllerSpec {
  const existing = eventControllerSpecs.find((itr) => itr.clazz === clazz)
  if (!existing) {
    throw new EventControllerSpecNotFoundError(clazz.constructor.name)
  }
  return existing
}
