import { join } from 'path';

export const BACKEND_DIR = join(__dirname, '../../../..');
export const BACKEND_SERVER_SRC = join(BACKEND_DIR, 'backend-server/src');

export function backendSrc(path: string): string {
  return join(BACKEND_SERVER_SRC, path);
}

export function backendPath(path: string): string {
  return join(BACKEND_DIR, path);
}