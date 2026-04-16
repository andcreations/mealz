import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { getLogger, Logger } from '@mealz/backend-logger';
import { SocketMessage } from '@mealz/backend-socket-gateway-api';

@Injectable()
export class SocketGatewayService {
  private server: Server;
  private clientsByUserId: Map<string, Socket> = new Map();

  public constructor(
    private readonly logger: Logger,
  ) {}

  public setServer(server: Server): void {
    this.server = server;
  }

  public handleConnection(client: Socket): void {
    const user: AuthUser | undefined = client.data.user;
    if (!user) {
      getLogger().warning('Socket connected without user', {
        correlationId: client.data.correlationId,
        socketId: client.id,
      });
      client.disconnect();
      return;
    }

    getLogger().debug('Socket connected', {
      correlationId: client.data.correlationId,
      socketId: client.id,
      userId: user?.id,
    });
    client.emit('connected', { clientId: client.id });
    this.clientsByUserId.set(user.id, client);
  }

  public handleDisconnect(client: Socket): void {
    const user: AuthUser | undefined = client.data.user;
    if (!user) {
      getLogger().warning('Socket disconnected without user', {
        correlationId: client.data.correlationId,
        socketId: client.id,
      });
      return;
    }

    getLogger().debug('Socket disconnected', {
      correlationId: client.data.correlationId,
      socketId: client.id,
      userId: user?.id,
    });
    this.clientsByUserId.delete(user.id);
  }

  public sendMessageToUser<TPayload>(
    userId: string,
    payload: SocketMessage<TPayload>,
    context: Context,
  ): void {
    const client = this.clientsByUserId.get(userId);
    if (!client) {
      this.logger.warning('Socket not found for user', {
        ...context,
        userId,
      });
      return;
    }

    client.emit('message', JSON.stringify(payload));
  }

  public sendMessageToAllUsers<TPayload>(
    payload: SocketMessage<TPayload>,
    _context: Context,
  ): void {
    if (!this.server) {
      this.logger.warning(
        'Socket server not found while sending message to all users',
        {
          ..._context,
          payload: JSON.stringify(payload),
        },
      );
      return;
    }
    this.logger.debug('Sending message to all users', {
      ..._context,
      payload: JSON.stringify(payload),
    });
    this.server.emit('message', JSON.stringify(payload));
  }

  public handleMessage(
    client: Socket,
    payload: unknown,
  ): { event: string; data: unknown } {
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
