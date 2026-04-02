import { ActionStatus } from './ActionStatus';

export class Action {
  // Action identifier
  public id: string;

  // Domain to which to send the request with the payload
  public domain: string;

  // Service to which to send the request with the payload
  public service: string;

  // Topic to which to send to request with the payload
  public topic: string;

  // Request payload
  public payload: unknown;

  // Action status
  public status: ActionStatus;

  // Error message on failure
  public error?: string;

  // Timestamp (UTC) when the action was created
  public createdAt: number;

  // Timestamp (UTC) when the action was executed
  public executedAt?: number;
}