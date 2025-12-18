import { Injectable, NestMiddleware } from '@nestjs/common';
import { getLogger } from '@mealz/backend-logger';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  public use(
    request: any,
    response: any,
    next: () => void,
  ): void {
    const url = request.originalUrl; // it's there!

    // log only api requests
    if (!url.startsWith('/api/')) {
      return next();
    }

    // duration
    request.mealzStartTime = Date.now();
    const duration = () => Date.now() - (request as any).mealzStartTime;

    const logResponse = () => {
      if ((response as any).mealzLogged === true) {
        return;
      }
      (response as any).mealzLogged = true;

      getLogger().debug('HTTP response', {
        correlationId: request.correlationId,
        duration: duration(),
        statusCode: response.statusCode,
        url,
      });
    };

    // body
    const bodyMethods = ['POST', 'PUT', 'PATCH'];
    let body: any = undefined;
    if (bodyMethods.includes(request.method)) {
      body = request.body;
    }
  
    // log request
    getLogger().debug('HTTP request', {
      correlationId: request.correlationId,
      method: request.method,
      url,
      ...(body ? { body } : {}),
    });

    response.on('finish', logResponse);
    response.on('error', logResponse);

    next();
  }
}