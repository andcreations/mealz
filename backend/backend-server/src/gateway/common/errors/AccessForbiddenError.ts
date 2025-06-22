
import { HttpException, HttpStatus } from '@nestjs/common';

// We must extend HttpException as this error is thrown from AuthGuard.
// Errors from guards don't go through the global exception filter.
export class AccessForbiddenError extends HttpException {
  public static readonly CODE = AccessForbiddenError.name;

  constructor() {
    super(
      {
        message: 'Access forbidden',
        code: AccessForbiddenError.CODE,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}