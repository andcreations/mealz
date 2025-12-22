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
  chunks: ChunkedUserNotificationChunk[];
}