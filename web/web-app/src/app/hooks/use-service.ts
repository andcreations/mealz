import { IoC } from '@andcreations/common';

export function useService<T>(clazz: new (...args: any[]) => T): T {
  return IoC.resolve(clazz);
}