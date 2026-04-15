import { Action } from './Action';

export type ActionForCreation = Pick<Action,
  | 'domain'
  | 'service'
  | 'topic'
  | 'payload'
>;