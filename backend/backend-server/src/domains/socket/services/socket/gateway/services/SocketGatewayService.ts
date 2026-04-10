import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthUser } from '@mealz/backend-gateway-core';
import { getLogger } from '@mealz/backend-logger';

@Injectable()
export class SocketGatewayService {
  private server: Server;

  public setServer(server: Server): void {
    this.server = server;
  }

  public handleConnection(client: Socket): void {
    const user: AuthUser | undefined = client.data.user;
    getLogger().debug('Socket connected', {
      correlationId: client.data.correlationId,
      socketId: client.id,
      userId: user?.id,
    });
    client.emit('connected', { clientId: client.id });
  }

  public handleDisconnect(client: Socket): void {
    const user: AuthUser | undefined = client.data.user;
    getLogger().debug('Socket disconnected', {
      correlationId: client.data.correlationId,
      socketId: client.id,
      userId: user?.id,
    });
  }

  public handleMessage(client: Socket, payload: unknown): { event: string; data: unknown } {
    return {
      event: 'message',
      data: payload,
    };
  }

  public emitToAll(event: string, data: unknown): void {
    this.server?.emit(event, data);
  }

  public emitToRoom(room: string, event: string, data: unknown): void {
    this.server?.to(room).emit(event, data);
  }

  public async joinRoom(client: Socket, room: string): Promise<void> {
    await client.join(room);
  }

  public async leaveRoom(client: Socket, room: string): Promise<void> {
    await client.leave(room);
  }
}
