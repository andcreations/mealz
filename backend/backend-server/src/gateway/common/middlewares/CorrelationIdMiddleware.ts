import { Injectable, NestMiddleware } from '@nestjs/common';
import { generateCorrelationId } from '@mealz/backend-core';

import { HTTP_CORRELATION_ID_PREFIX } from '../consts';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  public use(req: any, res: any, next: () => void) {
    (req as any).correlationId = generateCorrelationId(
      HTTP_CORRELATION_ID_PREFIX,
    );
    next();
  }
}