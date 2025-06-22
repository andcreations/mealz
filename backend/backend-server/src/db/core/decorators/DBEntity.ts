import { DBEntityClass } from '../types';
import { addDBEntitySpec } from '../spec';

export interface DBEntityOptions {
  name: string;
}

export const DBEntity = (
  name: string,
  options?: Omit<DBEntityOptions, 'name'>,
): ClassDecorator => {  
  return (target: Function): void => {
    addDBEntitySpec({
      name,
      clazz: target as DBEntityClass,
    });
  };
}