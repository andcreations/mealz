import { SocketMessage } from '@mealz/backend-socket-gateway-api';
import { GWGlassFraction } from '../types';

export const HYDRATION_LOGGED_SOCKET_MESSAGE_TOPIC_V1 = 'hydration-logged-v1';

export interface HydrationLoggedSocketMessageV1Payload {
  glassFraction: GWGlassFraction;
  loggedAt: number;
}

export interface HydrationLoggedSocketMessageV1
  extends SocketMessage<HydrationLoggedSocketMessageV1Payload>
{
  topic: typeof HYDRATION_LOGGED_SOCKET_MESSAGE_TOPIC_V1;
  payload: HydrationLoggedSocketMessageV1Payload;
}