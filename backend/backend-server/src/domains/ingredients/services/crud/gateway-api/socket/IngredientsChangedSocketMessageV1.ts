import { SocketMessage } from '@mealz/backend-socket-gateway-api';

export const INGREDIENTS_CHANGED_SOCKET_MESSAGE_TOPIC_V1 =
  'ingredients-changed-v1';

export interface IngredientsChangedSocketMessageV1Payload {}

export interface IngredientsChangedSocketMessageV1
  extends SocketMessage<IngredientsChangedSocketMessageV1Payload>
{
  topic: typeof INGREDIENTS_CHANGED_SOCKET_MESSAGE_TOPIC_V1;
  payload: IngredientsChangedSocketMessageV1Payload;
}