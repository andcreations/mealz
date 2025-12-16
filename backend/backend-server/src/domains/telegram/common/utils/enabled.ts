import { getBoolEnv } from '@mealz/backend-common';

export function isTelegramEnabled(): boolean {
  return getBoolEnv('MEALZ_TELEGRAM_ENABLED', false);
}