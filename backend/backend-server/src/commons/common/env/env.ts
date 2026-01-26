import { InternalError } from '../errors';

const BOOL_TRUE = ['true'];
const BOOL_FALSE = ['false'];
const BOOL_VALID_VALUES = [...BOOL_TRUE, ...BOOL_FALSE];

export function getStrEnv(
  name: string,
  defaultValue?: string,
): string | undefined {
  return process.env[name] ?? defaultValue;
}

export function requireStrEnv(name: string): string {
  const value = getStrEnv(name);
  if (value === undefined) {
    throw new InternalError(`Environment variable ${name} not set`);
  }
  return value;
}

export function getBoolEnv(
  name: string,
  defaultValue?: boolean,
): boolean | undefined {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  if (!BOOL_VALID_VALUES.includes(value)) {
    throw new InternalError(
      `Environment variable ${name} is invalid. ` +
      `Valid values are ${BOOL_VALID_VALUES.join(', ')}`
    );
  }
  return BOOL_TRUE.includes(value);
}

export function requireBoolEnv(name: string): boolean {
  const value = getBoolEnv(name);
  if (value === undefined) {
    throw new InternalError(`Environment variable ${name} not set`);
  }
  return value;
}

function isInt(value: string): boolean {
  return /^-?\d+$/.test(value);
}

export function getIntEnv(
  name: string,
  defaultValue?: number,
): number | undefined {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  if (!isInt(value)) {
    throw new InternalError(`Environment variable ${name} is not an integer`);
  }
  return parseInt(value);
}

export function requireIntEnv(name: string): number {
  const value = getIntEnv(name);
  if (value === undefined) {
    throw new InternalError(`Environment variable ${name} not set`);
  }
  return value;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isSecure(): boolean {
  return false;
}