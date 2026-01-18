import { getBoolEnv } from '@mealz/backend-common';

export function isTracingEnabled(): boolean {
  return getBoolEnv('MEALZ_TRACING_ENABLED', false);
}