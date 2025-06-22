import { MealzError } from './MealzError';

export function errorToString(error: any): string {
  if (error instanceof MealzError) {
    return `[${error.getCode()}]: ${error.getMessage()}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
}