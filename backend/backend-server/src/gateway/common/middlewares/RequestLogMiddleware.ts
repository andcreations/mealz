import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { getLogger } from '../../../logger';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  public use(
    request: FastifyRequest['raw'],
    response: FastifyReply['raw'],
    next: () => void,
  ) {
    const url = (request as any).originalUrl; // it's there!

    // log only api requests
    if (!url.startsWith('/api/')) {
      return next();
    }

    (request as any).mealzStartTime = Date.now();
    const took = () => Date.now() - (request as any).mealzStartTime;

    const logResponse = () => {
      if ((response as any).mealzLogged === true) {
        return;
      }
      (response as any).mealzLogged = true;

      getLogger().debug('HTTP response', {
        correlationId,
        took: took(),
        statusCode: response.statusCode,
        url,
      });
    };

    const correlationId = (request as any).correlationId;
    getLogger().debug('HTTP request', {
      correlationId,
      method: request.method,
      url,
    });

    response.on('finish', logResponse);
    response.on('error', logResponse);

    next();
  }
}