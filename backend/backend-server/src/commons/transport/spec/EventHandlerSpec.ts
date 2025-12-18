import { Context } from '@mealz/backend-core'

import {
  EventHandlerSpecNotFoundError,
  DuplicatedEventHandlerError,
  EventHandlerNotFoundError
} from '../errors'
import { EventControllerClass } from '../types'

export interface EventHandlerSpec {
  clazz: EventControllerClass
  topic: string
  methodName: string
  classInstance?: object
}

const eventHandlerSpecs: EventHandlerSpec[] = []

export function addEventHandlerSpec(spec: EventHandlerSpec): void {
  eventHandlerSpecs.push(spec)
}

export function getEventHandlerSpecs(
  clazz: EventControllerClass
): EventHandlerSpec[] {
  return eventHandlerSpecs.filter((itr) => itr.clazz === clazz)
}

export function setEventHandlerClassInstance(
  topic: string,
  classInstance: object
): void {
  const spec = eventHandlerSpecs.find(
    (itr) => itr.topic === topic && !itr.classInstance
  )
  if (!spec) {
    throw new EventHandlerSpecNotFoundError(topic)
  }
  if (spec.classInstance) {
    throw new DuplicatedEventHandlerError(topic)
  }
  spec.classInstance = classInstance
}

export async function callEventHandlers<TEvent>(
  topic: string,
  event: TEvent,
  context: Context
): Promise<void> {
  const specs = eventHandlerSpecs.filter(
    (itr) => itr.topic === topic && !!itr.classInstance
  )
  if (specs.length === 0) {
    return
  }
  const results = await Promise.allSettled(
    specs.map(async (spec) => callEventHandler(spec, event, context))
  )
  for (const result of results) {
    if (result.status === 'rejected') {
      throw result.reason
    }
  }
}

async function callEventHandler<TEvent>(
  spec: EventHandlerSpec,
  event: TEvent,
  context: Context
): Promise<void> {
  const { classInstance, methodName } = spec
  if (!classInstance) {
    throw new EventHandlerNotFoundError(spec.topic)
  }
  await classInstance[methodName](event, context)
}
