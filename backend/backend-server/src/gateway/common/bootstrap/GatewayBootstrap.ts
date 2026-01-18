import {
  HttpException,
  HttpStatus,
  INestApplication,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { registerMetric } from '@mealz/backend-metrics';

import { METRIC_HTTP_REQUESTS_TOTAL } from '../consts';
import { ErrorsInterceptor } from '../errors';

export class GatewayBootstrap {
  private useValidationPipe(app: INestApplication): void {
    const options: ValidationPipeOptions = {
      exceptionFactory: (errors: ValidationError[]): HttpException => {
        return new HttpException(
          {
            message: errors.join(','),
            code: 'request-validation-error'
          },
          HttpStatus.BAD_REQUEST
        );
      }
    };
    app.useGlobalPipes(new ValidationPipe(options));
  }
  
  private useExceptionInterceptor(app: INestApplication): void {
    app.useGlobalInterceptors(new ErrorsInterceptor());
  }

  private registerMetrics(): void {
    registerMetric({
      name: METRIC_HTTP_REQUESTS_TOTAL,
      type: 'counter',
      description: 'Total number of HTTP requests',
      labels: ['method', 'path', 'status'],
    });
  }

  public bootstrap(app: INestApplication): void {
    this.useValidationPipe(app);
    this.useExceptionInterceptor(app);
    this.registerMetrics();
  }

  public async shutdown(): Promise<void> {
  }
}