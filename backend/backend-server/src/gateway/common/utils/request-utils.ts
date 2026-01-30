import { InternalError } from '@mealz/backend-common';

export function getCorrelationIdFromRequest(request: any): string {
  return request.correlationId;
}

export function getHeaderFromRequest(request: any, header: string): string {
  return request.headers[header];
}