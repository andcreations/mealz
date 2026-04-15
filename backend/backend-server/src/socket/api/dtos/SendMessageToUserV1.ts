import { SocketMessage } from '@mealz/backend-socket-gateway-api';

export interface SendMessageToUserV1Request<TPayload> {
  userId: string;
  payload: SocketMessage<TPayload>;
}