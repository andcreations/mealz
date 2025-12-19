import { InternalError, MealzError } from '../errors';

export function parsePropertiesFromEnv(
  envValue: string,
): Record<string, string> {
  const properties: Record<string, string> = {};
  const pairs = envValue.split(';');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    properties[key] = value;
  }
  return properties;
}

export function validatePropertiesFromEnv(
  envName: string,
  properties: Record<string, string>,
  validation: {
    required: string[];
    optional: string[];
  }
): void {
  for (const required of validation.required) {
    if (!properties[required]) {
      throw new InternalError(
        `Property ${MealzError.quote(required)} is required in ` +
        `environment variable ${MealzError.quote(envName)}`
      );
    }
  }
  const keys = Object.keys(properties);
  for (const key of keys) {
    if (!validation.required.includes(key) && !validation.optional.includes(key)) {
      throw new InternalError(
        `Property ${MealzError.quote(key)} is not allowed in ` +
        `environment variable ${MealzError.quote(envName)}`
      );
    }
  }
}