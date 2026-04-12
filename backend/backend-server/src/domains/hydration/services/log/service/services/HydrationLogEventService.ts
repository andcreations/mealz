import { Context } from '@mealz/backend-core';
import { Injectable } from '@nestjs/common';
import { SocketRequestTransporter } from '@mealz/backend-socket-api';
import {
  HydrationLoggedExternallyEventV1,
} from '@mealz/backend-hydration-log-service-api';
import {
  HYDRATION_LOGGED_SOCKET_MESSAGE_TOPIC_V1,
  HydrationLoggedSocketMessageV1Payload,
} from '@mealz/backend-hydration-log-gateway-api';

@Injectable()
export class HydrationLogEventService {
  public constructor(
    private readonly socketRequestTransporter: SocketRequestTransporter,
  ) {}

  public async hydrationLoggedExternallyV1(
    event: HydrationLoggedExternallyEventV1,
    context: Context,
  ): Promise<void> {
    await this.socketRequestTransporter.sendMessageToUserV1<
      HydrationLoggedSocketMessageV1Payload
    >(
      {
        userId: event.userId,
        payload: {
          topic: HYDRATION_LOGGED_SOCKET_MESSAGE_TOPIC_V1,
          payload: {
            glassFraction: event.glassFraction,
            loggedAt: event.loggedAt,
          },
        },
      },
      context,
    );
  }
}