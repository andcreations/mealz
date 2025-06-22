import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context, ContextUser } from '#mealz/backend-core';
import { getCorrelationIdFromRequest } from '../utils';

export const GWContext = createParamDecorator(
  (data: any, context: ExecutionContext): Context => {
    const request = context.switchToHttp().getRequest();
    const user = (): { user?: ContextUser } => {
      if (!request.user) {
        return {};
      }
      return {
        user: {
          id: request.user.id,
          roles: request.user.roles,
        },
      }
    }

    return {
      correlationId: getCorrelationIdFromRequest(request),
      ...user(),
    }
  }
);