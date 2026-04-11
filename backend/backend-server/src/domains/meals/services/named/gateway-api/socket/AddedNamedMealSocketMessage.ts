import { SocketMessage } from '@mealz/backend-socket-gateway-api';

export const ADDED_NAMED_MEAL_SOCKET_MESSAGE_TOPIC = 'added-named-meal';

export interface AddedNamedMealSocketMessagePayload {
  namedMealId: string;
}

export interface AddedNamedMealSocketMessage
  extends SocketMessage<AddedNamedMealSocketMessagePayload>
{
  topic: typeof ADDED_NAMED_MEAL_SOCKET_MESSAGE_TOPIC;
  payload: AddedNamedMealSocketMessagePayload;
}