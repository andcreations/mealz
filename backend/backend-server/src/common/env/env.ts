import { InternalError } from '../errors';

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
  return value !== undefined ? ['true', '1'].includes(value) : defaultValue;
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

export function isFastify(): boolean {
  return isProduction() === true;
}

export function isExpress(): boolean {
  return isProduction() === false;
}

export function isSecure(): boolean {
  return false;
}