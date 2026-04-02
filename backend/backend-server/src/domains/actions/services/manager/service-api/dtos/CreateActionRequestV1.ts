import { Action } from '../types';

export class CreateActionRequestV1 {
  // Action to create
  public action: Pick<Action, 'domain' | 'service' | 'topic' | 'payload'>;
}