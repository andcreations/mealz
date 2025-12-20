import { AdminNotificationType } from './AdminNotificationType';

export interface AdminNotification {
  // Notification type
  type?: AdminNotificationType;
  title?: string;
  message?: string;
} 