import { Injectable, Provider } from '@nestjs/common'
import { Context } from '@mealz/backend-core'
import { getLogger } from '@mealz/backend-logger'

import { callEventHandlers } from '../spec'
import { EventTransporter } from './EventTransporter'

@Injectable()
export class LocalEventTransporter extends EventTransporter {
  public async emitEvent<TEvent>(
    topic: string,
    event: TEvent,
    context: Context
  ): Promise<void> {
    try {
      await callEventHandlers<TEvent>(topic, event, context)
    } catch (error) {
      getLogger().error(
        `Error sending event over local transporter`,
        {
          ...context,
          topic,
          event: JSON.stringify(event),
        },
        error
      )
    }
  }

  public static provide(): Provider<LocalEventTransporter> {
    return {
      provide: LocalEventTransporter,
      useClass: LocalEventTransporter,
    }
  }
}
