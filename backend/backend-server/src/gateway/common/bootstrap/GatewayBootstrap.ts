import {
  HttpException,
  HttpStatus,
  INestApplication,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

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

  public bootstrap(app: INestApplication): void {
    this.useValidationPipe(app);
    this.useExceptionInterceptor(app);
  }
}