import { useBusEventListener } from '../../bus';
import { socketMessageTopic } from '../decorators';

export function useSocketMessage<TPayload>(
  topic: string,
  listener: (payload: TPayload) => void,
): void {
  return useBusEventListener<TPayload>(socketMessageTopic(topic), listener);
}