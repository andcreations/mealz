import { BasicUserNotification, NotificationAction } from '../types';

export interface SendBasicUserNotificationRequestV1 {
  // User identifier
  userId: string;

  // Message type identifier
  messageTypeId: string;

  // Notification to send
  notification: BasicUserNotification;

  // Actions the user can perform
  actions?: NotificationAction[];
}