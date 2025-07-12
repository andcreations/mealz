import { Context } from '@mealz/backend-core';

import { callRequestHandler } from '../spec';
import { Transporter } from './Transporter';

export class LocalTransporter extends Transporter {
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