import { ChunkedUserNotification } from '../types';

export interface SendChunkedUserNotificationRequestV1 {
  userId: string;
  messageTypeId: string;
  notification: ChunkedUserNotification;
}