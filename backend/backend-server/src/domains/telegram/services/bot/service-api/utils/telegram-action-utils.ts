const ACTION_CALLBACK_DATA_PREFIX = 'action_';

export function getActionCallbackData(actionId: string): string {
  return `${ACTION_CALLBACK_DATA_PREFIX}${actionId}`;
}

export function isActionCallbackData(data: string): boolean {
  return data.startsWith(ACTION_CALLBACK_DATA_PREFIX);
}

export function getActionIdFromCallbackData(data: string): string {
  return data.substring(ACTION_CALLBACK_DATA_PREFIX.length);
}