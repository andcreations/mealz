import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketAuthMiddleware } from '../middlewares';
import { SocketGatewayService } from '../services';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGatewayController
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  public constructor(
    private readonly socketGatewayService: SocketGatewayService,
    private readonly socketAuthMiddleware: SocketAuthMiddleware,
  ) {}

  public afterInit(server: Server): void {
    server.use(this.socketAuthMiddleware.createMiddleware());
    this.socketGatewayService.setServer(server);
  }

  public handleConnection(client: Socket): void {
    this.socketGatewayService.handleConnection(client);
  }

  public handleDisconnect(client: Socket): void {
    this.socketGatewayService.handleDisconnect(client);
  }

  @SubscribeMessage('message')
  public handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: unknown,
  ): { event: string; data: unknown } {
    return this.socketGatewayService.handleMessage(client, payload);
  }

  @SubscribeMessage('join-room')
  public async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ): Promise<void> {
    await this.socketGatewayService.joinRoom(client, room);
  }

  @SubscribeMessage('leave-room')
  public async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ): Promise<void> {
    await this.socketGatewayService.leaveRoom(client, room);
  }
}
