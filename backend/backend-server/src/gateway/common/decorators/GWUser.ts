import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '@mealz/backend-gateway-core';

export const GWUser = createParamDecorator(
  (_data: any, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);