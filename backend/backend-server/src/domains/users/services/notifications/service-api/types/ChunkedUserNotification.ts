import { NotificationAction } from './NotificationAction';

export enum ChunkedUserNotificationType {
  Normal = 'normal',
  Bold = 'bold',
  Code = 'code',
}

export interface ChunkedUserNotificationChunk {
  text: string;
  type: ChunkedUserNotificationType;
}

export interface ChunkedUserNotification {
  // Chunks of the notification
  chunks: ChunkedUserNotificationChunk[];

  // Actions the user can perform
  actions?: NotificationAction[];
}