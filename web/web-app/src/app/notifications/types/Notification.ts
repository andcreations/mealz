export enum NotificationType {
  Info = 'info',
  Error = 'error',
}

export interface Notification {
  message: string;
  type: NotificationType;
  showTime?: number;
  undo?: () => void;
}