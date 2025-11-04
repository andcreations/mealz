import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';

import { useBusEventListener } from '../../bus';
import { usePatchState } from '../../hooks';
import { NotificationsTopics } from '../bus';
import { Notification, NotificationType } from '../types';

interface NotificationsState {
  notification?: Notification;
  visible: boolean;
}

export function Notifications() {
  const [state, setState] = useState<NotificationsState>({
    visible: false,
  });
  const patchState = usePatchState(setState);

  useBusEventListener(
    NotificationsTopics.NotificationAdded,
    (notification: Notification) => {
      patchState({
        notification,
        visible: true,
      });
    }
  );

  useBusEventListener(
    NotificationsTopics.NotificationRemoved,
    () => {
      patchState({
        visible: false,
      });
    }
  );

  const hidden = !state.visible || !state.notification;
  const error = state.notification?.type === NotificationType.Error;
  const notificationClassNames = classNames([
    'mealz-notifications-notification',
    { 'mealz-notifications-notification-hidden': hidden },
    { 'mealz-notifications-notification-error': error },
  ]);

  return (
    <div className='mealz-notifications'>
      <div className={notificationClassNames}>
        { state.notification?.message ?? ''}
      </div>
    </div>
  );
}