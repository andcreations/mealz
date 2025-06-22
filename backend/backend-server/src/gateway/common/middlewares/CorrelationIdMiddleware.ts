import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { generateCorrelationId } from '#mealz/backend-core';
import { isExpress, isFastify } from '#mealz/backend-common';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  public use(req: any, res: any, next: () => void) {
    if (isFastify()) {
      this.useFastify(req, res, next);
    }
    if (isExpress()) {
      this.useExpress(req, res, next);
    }
  }

  public useFastify(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ) {
    (req as any).correlationId = generateCorrelationId();
    next();
  }

  public useExpress(req: Request, res: Response, next: () => void) {
    (req as any).correlationId = generateCorrelationId();
    next();
  }
}