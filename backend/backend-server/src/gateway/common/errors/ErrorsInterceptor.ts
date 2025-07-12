import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getLogger } from '@mealz/backend-logger';
import { MealzError } from '@mealz/backend-common';
import { getCorrelationIdFromRequest } from '../utils';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const correlationId = getCorrelationIdFromRequest(request);

    return next
      .handle()
      .pipe(
        catchError((error): ObservableInput<any> => {
          if (error instanceof MealzError) {
            getLogger().error('Caught error', {
              correlationId,
              id: correlationId,
              statusCode: error.getHTTPStatus(),
              message: error.getMessage(),
              stack: error.stack ?? 'No stack trace',
              code: error.getCode()
            });

            return throwError(() => {
              return new HttpException(
                {
                  message: error.getMessage(),
                  code: error.getCode(),
                  statusCode: error.getHTTPStatus()
                },
                error.getHTTPStatus()
              );
            });
          }
          if (error instanceof HttpException) {
            getLogger().error('Caught HTTP exception', {
              correlationId,
              id: correlationId,
              message: error.message,
              statusCode: error.getStatus(),
              stack: error.stack ?? 'No stack trace'
            });

            return throwError(() => {
              return new HttpException(
                { 
                  message: error.message, 
                  id: correlationId,
                  statusCode: error.getStatus()
                },
                error.getStatus()
              );
            });
          }
          if (error instanceof Error) {
            getLogger().error('Caught unexpected error', {
              correlationId,
              id: correlationId,
              message: error.message,
              stack: error.stack ?? 'No stack trace'
            });

            return throwError(() => {
              return new HttpException(
                { 
                  message: 'Internal server error', 
                  id: correlationId,
                  statusCode: HttpStatus.INTERNAL_SERVER_ERROR
                },
                HttpStatus.INTERNAL_SERVER_ERROR
              );
            });
          }

          getLogger().error('Caught unexpected error', {
            correlationId,
            id: correlationId,
          });          

          return throwError(() => {
            return new HttpException(
              { 
                message: 'Internal server error', 
                id: correlationId,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          });
        }),
      );
  }
}