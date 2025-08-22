import { Context } from '@mealz/backend-core';

import { callRequestHandler } from '../spec';
import { RequestTransporter } from './RequestTransporter';

export class LocalRequestTransporter extends RequestTransporter {
  public constructor() {
    super();
  }

  public async sendRequest<TRequest, TResponse>(
    topic: string,
    request: TRequest,
    context: Context,
  ): Promise<TResponse> {
    return callRequestHandler<TRequest, TResponse>(topic, request, context);
  }
}