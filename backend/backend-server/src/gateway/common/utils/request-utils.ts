import { isExpress, isFastify } from '#mealz/backend-common';

export function getCorrelationIdFromRequest(request: any): string {
  if (isFastify()) {
    return request.raw.correlationId;
  }
  if (isExpress()) {
    return request.correlationId;
  }
  return '';
}
