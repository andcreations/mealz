import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import { SOCKET_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { SocketRequestTopics } from './SocketRequestTopics';
import { 
  SendMessageToAllUsersV1Request,
  SendMessageToUserV1Request,
} from './dtos';

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

  public sendMessageToAllUsersV1<TPayload>(
    request: SendMessageToAllUsersV1Request<TPayload>,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      SendMessageToAllUsersV1Request<TPayload>,
      VoidTransporterResponse
    >(SocketRequestTopics.SendMessageToAllUsersV1, request, context);
  }
}