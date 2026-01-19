import { v7 } from 'uuid';
import { ContextUser } from './ContextUser';

export interface Context {
  correlationId: string;
  user?: ContextUser;
  
  // Identifier of what happened, machine-friendly name, e.g. user.login
  eventName?: string;

  // Other attributes
  [key: string]: any;
}

export function generateCorrelationId(prefix?: string): string {
  return prefix ? `${prefix}:${v7()}` : v7();
}

export const BOOTSTRAP_CONTEXT: Context = {
  correlationId: generateCorrelationId('bootstrap'),
};

export const SHUTDOWN_CONTEXT: Context = {
  correlationId: generateCorrelationId('shutdown'),
};

export function contextToAttributes(
  context: Context,
): Record<string, string | number | boolean> {
  const attributes: Record<string, string | number | boolean> = {};
  Object.keys(context).forEach(key => {
    const value = context[key];
    const type = typeof context[key];
    if (value == null) {
      attributes[key] = null;
    }
    else if (['string', 'number', 'boolean'].includes(type)) {
      attributes[key] = context[key];
    }
    else {
      attributes[key] = JSON.stringify(context[key]);
    }
  });
  return attributes;
}
