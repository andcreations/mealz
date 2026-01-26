import { Injectable, NestMiddleware } from '@nestjs/common';
import { generateCorrelationId } from '@mealz/backend-core';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  public use(req: any, res: any, next: () => void) {
    (req as any).correlationId = generateCorrelationId();
    next();
  }
}