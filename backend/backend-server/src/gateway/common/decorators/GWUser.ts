import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GWUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);