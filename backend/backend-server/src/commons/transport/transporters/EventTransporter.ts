import { Context } from '@mealz/backend-core'

export abstract class EventTransporter {
  public abstract emitEvent<TEvent>(
    topic: string,
    event: TEvent,
    context: Context
  ): Promise<void>
}
