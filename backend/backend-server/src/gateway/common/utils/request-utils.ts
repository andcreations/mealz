import { InternalError, isExpress, isFastify } from '@mealz/backend-common';

export function getCorrelationIdFromRequest(request: any): string {
  if (isFastify()) {
    return request.raw.correlationId;
  }
  if (isExpress()) {
    return request.correlationId;
  }
  return '';
}

export function getHeaderFromRequest(request: any, header: string): string {
  if (isFastify()) {
    return request.raw.getHeader(header);
  }
  if (isExpress()) {
    return request.headers[header];
  }
  throw new InternalError('Invalid request type when getting header');
}