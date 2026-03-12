import { IoC } from '@andcreations/common';
import { EventLog } from '../services';

const eventLogService = IoC.resolve(EventLog);

export function logDebugEvent(eventType: string, eventData?: object): void {
  eventLogService.log('debug', eventType, eventData);
}

export function logInfoEvent(eventType: string, eventData?: object): void {
  eventLogService.log('info', eventType, eventData);
}

export function logErrorEvent(
  eventType: string,
  eventData: object | undefined,
  error?: any,
): void {
  if (eventData instanceof Error) {
    error = eventData;
    eventData = undefined;
  }
  eventData = eventData ?? {};

  if (error) {
    if (error instanceof Error) {
      eventData['error'] = {
        message: error.message,
        stack: error.stack,
      };
    }
    else {
      eventData['error'] = error.toString();
    }
  }

  eventLogService.log('error', eventType, eventData);
}