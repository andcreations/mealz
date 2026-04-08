import { NotificationAction } from './NotificationAction';

export interface BasicUserNotification {
  // Message to send
  message: string;

  // Actions the user can perform
  actions?: NotificationAction[];
}