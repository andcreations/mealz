import { join } from 'path';

export const BACKEND_SERVER_SRC = join(
  __dirname,
  '../../../../backend-server/src',
);

export function backendSrc(path: string): string {
  return join(BACKEND_SERVER_SRC, path);
}