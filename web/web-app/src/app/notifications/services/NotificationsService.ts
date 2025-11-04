import { Service } from '@andcreations/common';

import { BusService } from '../../bus';
import { Notification, NotificationType } from '../types';
import { NotificationsTopics } from '../bus';

@Service()
export class NotificationsService {
  private static readonly NOTIFICATION_SHOW_TIME = 3072;
  private static readonly NEXT_NOTIFICATION_DELAY = 320;

  private notifications: Notification[] = [];
  private addNotificationTimer: NodeJS.Timeout | undefined;
  private removeNotificationTimer: NodeJS.Timeout | undefined;
  
  public constructor(
    private readonly busService: BusService,
  ) {}

  public info(message: string) {
    this.pushNotification({ message, type: NotificationType.Info });
  }

  public error(message: string) {
    this.pushNotification({ message, type: NotificationType.Error });
  }

  public pushNotification(notification: Notification) {
    this.notifications.push(notification);
    this.tryShowNextNotification();
  }

  private tryShowNextNotification(): void {
    // no notification to show or already showing a notification
    if (
      this.notifications.length === 0 ||
      this.addNotificationTimer ||
      this.removeNotificationTimer
    ) {
      return;
    }
    const notification = this.notifications.shift();

    // show
    this.busService.emit(
      NotificationsTopics.NotificationAdded,
      notification,
    );

    // wait a bit before removing the notification
    this.addNotificationTimer = setTimeout(
      () => {
        // hide
        this.addNotificationTimer = undefined;
        this.busService.emit(
          NotificationsTopics.NotificationRemoved,
          notification
        );

        // wait a bit before showing the next notification
        this.removeNotificationTimer = setTimeout(
          () => {
            this.removeNotificationTimer = undefined;
            this.tryShowNextNotification();
          },
          NotificationsService.NEXT_NOTIFICATION_DELAY,
        );
      },
      NotificationsService.NOTIFICATION_SHOW_TIME,
    );
  }
}