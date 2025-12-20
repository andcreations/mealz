import { BasicUserNotification } from '../types';

export interface SendBasicUserNotificationRequestV1 {
  userId: string;
  notification: BasicUserNotification;
}