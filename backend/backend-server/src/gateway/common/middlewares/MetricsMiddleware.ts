import { Injectable, NestMiddleware } from '@nestjs/common';
import { incMetric, METRICS_API_URL } from '@mealz/backend-metrics';

import { METRIC_HTTP_REQUESTS_TOTAL } from '../consts';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  public use(
    request: any,
    response: any,
    next: () => void,
  ): void {
    const url = request.originalUrl; // it's there!

    const onResponse = () => {
      if (url.startsWith(METRICS_API_URL)) {
        return;
      }
      incMetric(METRIC_HTTP_REQUESTS_TOTAL,
        {
          method: request.method,
          path: url,
        },
        1,
      );
    };

    response.on('finish', onResponse);
    response.on('error', onResponse);

    next();
  }
}