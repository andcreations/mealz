import { Context } from '@mealz/backend-core';
import { 
  RequestController,
  RequestHandler,
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  SendMessageToUserV1Request,
  SocketRequestTopics,
} from '@mealz/backend-socket-api';

import { SocketGatewayService } from '../services';

@RequestController()
export class SocketGatewayRequestController {
  public constructor(
    private readonly socketGatewayService: SocketGatewayService,
  ) {}

  @RequestHandler(SocketRequestTopics.SendMessageToUserV1)
  public async sendMessageToUserV1(
    request: SendMessageToUserV1Request<unknown>,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    await this.socketGatewayService.sendMessageToUser(
      request.userId,
      request.payload,
      context,
    );
    return {};
  }
}