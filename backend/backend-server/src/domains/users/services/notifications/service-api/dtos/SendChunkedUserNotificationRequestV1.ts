import { ChunkedUserNotification } from '../types';

export interface SendChunkedUserNotificationRequestV1 {
  userId: string;
  notification: ChunkedUserNotification;
}