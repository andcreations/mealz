import { SocketMessage } from '@mealz/backend-socket-gateway-api';

export interface SendMessageToAllUsersV1Request<TPayload> {
  payload: SocketMessage<TPayload>;
}