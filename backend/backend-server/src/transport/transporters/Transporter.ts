import { Context } from '#mealz/backend-core';

export abstract class Transporter {
  public abstract sendRequest<TRequest, TResponse>(
    topic: string,
    request: TRequest,
    context: Context,
  ): Promise<TResponse>;
}