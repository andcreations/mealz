import { BasicUserNotification } from '../types';

export interface SendBasicUserNotificationRequestV1 {
  userId: string;
  messageTypeId: string;
  notification: BasicUserNotification;
}