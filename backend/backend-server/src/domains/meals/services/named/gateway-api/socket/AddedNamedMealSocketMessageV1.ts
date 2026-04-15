import { SocketMessage } from '@mealz/backend-socket-gateway-api';

export const ADDED_NAMED_MEAL_SOCKET_MESSAGE_TOPIC_V1 = 'added-named-meal-v1';

export interface AddedNamedMealSocketMessageV1Payload {
  namedMealId: string;
}

export interface AddedNamedMealSocketMessageV1
  extends SocketMessage<AddedNamedMealSocketMessageV1Payload>
{
  topic: typeof ADDED_NAMED_MEAL_SOCKET_MESSAGE_TOPIC_V1;
  payload: AddedNamedMealSocketMessageV1Payload;
}