import { BusEvent } from '@andcreations/common';

export function socketMessageTopic(topic: string): string {
  return `socket/${topic}`;
}

export const SocketMessage = (topic: string): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    return BusEvent(socketMessageTopic(topic))(
      target,
      propertyKey,
      descriptor,
     ) as PropertyDescriptor;
  }
}
