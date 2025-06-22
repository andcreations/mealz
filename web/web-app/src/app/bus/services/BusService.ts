import { handleBusEvent, handleBusRequest, Service } from '@andcreations/common';

@Service()
export class BusService {
  /**
   * Sends a request.
   * @param topic Topic.
   * @param payload Payload.
   */
  async send<T = void, R = void>(topic: string, payload?: T): Promise<R> {
    const result = await handleBusRequest<T, R>(topic, payload);
    return result;
  }

  /**
   * Emits an event to all the topic listeners.
   * @param topic Topic.
   * @param payload Payload.
   */
  async emit<T = void>(topic: string, payload?: T): Promise<void> {
    await handleBusEvent(topic, payload);
  }
}