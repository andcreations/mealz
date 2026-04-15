import { ChunkedUserNotification, NotificationAction } from '../types';

export interface SendChunkedUserNotificationRequestV1 {
  // User identifier
  userId: string;

  // Message type identifier
  messageTypeId: string;

  // Notification to send
  notification: ChunkedUserNotification;

  // Actions the user can perform
  actions?: NotificationAction[];
}