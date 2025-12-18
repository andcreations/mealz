import { Context } from '@mealz/backend-core';

export abstract class RequestTransporter {
  public abstract sendRequest<TRequest, TResponse>(
    topic: string,
    request: TRequest,
    context: Context,
  ): Promise<TResponse>;
}