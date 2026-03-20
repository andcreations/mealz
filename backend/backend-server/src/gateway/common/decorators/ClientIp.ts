import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress
    );
  },
);