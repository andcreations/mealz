import { v7 } from 'uuid';
import { ContextUser } from './ContextUser';

export interface Context {
  correlationId: string;
  user?: ContextUser;
  [key: string]: any;
}

export const BOOTSTRAP_CONTEXT: Context = {
  correlationId: 'bootstrap',
};

export const SHUTDOWN_CONTEXT: Context = {
  correlationId: 'shutdown',
};

export function generateCorrelationId(prefix?: string): string {
  return prefix ? `${prefix}:${v7()}` : v7();
}