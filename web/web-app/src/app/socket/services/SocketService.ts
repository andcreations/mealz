import { OnBootstrap, Service } from '@andcreations/common';
import { io, Socket } from 'socket.io-client';
import { SocketMessage } from '@mealz/backend-socket-gateway-api';

import { BusService } from '../../bus';
import { logDebugEvent, logErrorEvent } from '../../event-log';
import { eventType } from '../event-log';
import { SocketTopics } from '../bus';
import { socketMessageTopic } from '../decorators';

export interface SocketConnectedPayload {
  clientId: string;
}

@Service()
export class SocketService implements OnBootstrap {
  private socket: Socket | undefined;
  private connectedFlag = false;

  constructor(private readonly busService: BusService) {}

  public async onBootstrap(): Promise<void> {
    console.log('SocketService onBootstrap');
    this.connect();
  }

  public get connected(): boolean {
    return this.socket?.connected ?? false;
  }

  public get clientId(): string | undefined {
    return this.socket?.id;
  }

  public connect(): void {
    if (this.socket) {
      return;
    }

    try {
      logDebugEvent(eventType('connecting'));
      this.socket = io({
        withCredentials: true,
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        logDebugEvent(eventType('connected'));
        this.connectedFlag = true;
      });

      this.socket.on('connected', (payload: SocketConnectedPayload) => {
        logDebugEvent(eventType('server-acknowledged'), payload);
        this.busService.emit(SocketTopics.Connected, payload);
      });

      this.socket.on('disconnect', (reason: string) => {
        logDebugEvent(eventType('disconnected'), { reason });
        this.busService.emit(SocketTopics.Disconnected, { reason });
        this.connectedFlag = false;
      });

      this.socket.on('connect_error', (error: Error) => {
        logErrorEvent(eventType('connect-error'), error);
      });

      this.socket.on('message', (payloadStr: string) => {
        const payload = JSON.parse(payloadStr) as SocketMessage<unknown>;
        this.busService.emit(
          socketMessageTopic(payload.topic),
          payload.payload,
        );
        logDebugEvent(eventType('socket-message-received'), payload);
      });
    } catch (error) {
      logErrorEvent(eventType('failed-to-connect'), error);
    }
  }

  public disconnect(): void {
    if (!this.socket) {
      return;
    }
    this.socket.disconnect();
    this.socket = undefined;
    logDebugEvent(eventType('manual-disconnect'));
  }

  public isConnected(): boolean {
    return this.connectedFlag;
  }

  public on<T = unknown>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback as any);
  }

  public off<T = unknown>(
    event: string,
    callback?: (data: T) => void,
  ): void {
    if (callback) {
      this.socket?.off(event, callback as any);
    } else {
      this.socket?.off(event);
    }
  }

  public emit<T = unknown>(event: string, data?: T): void {
    this.socket?.emit(event, data);
  }

  public joinRoom(room: string): void {
    this.socket?.emit('join-room', room);
  }

  public leaveRoom(room: string): void {
    this.socket?.emit('leave-room', room);
  }
}
