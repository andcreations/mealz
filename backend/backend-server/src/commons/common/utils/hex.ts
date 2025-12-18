import { randomBytes } from 'crypto';

export function generateHex(length: number): string {
  return randomBytes(length).toString('hex');
}