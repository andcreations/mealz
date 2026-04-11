import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import { SOCKET_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { SendMessageToUserV1Request } from './dtos';
import { SocketRequestTopics } from './SocketRequestTopics';

@Injectable()
export class SocketRequestTransporter {
  public constructor(
    @Inject(SOCKET_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public sendMessageToUserV1<TPayload>(
    request: SendMessageToUserV1Request<TPayload>,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      SendMessageToUserV1Request<TPayload>,
      VoidTransporterResponse
    >(SocketRequestTopics.SendMessageToUserV1, request, context);
  }
}