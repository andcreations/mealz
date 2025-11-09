import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';

import { useBusEventListener } from '../../bus';
import { usePatchState } from '../../hooks';
import { useTranslations } from '../../i18n';
import { LinkButton } from '../../components';
import { NotificationsTopics } from '../bus';
import { Notification, NotificationType } from '../types';
import { NotificationsTranslations } from './Notifications.translations';

interface NotificationsState {
  notification?: Notification;
  visible: boolean;
}

export function Notifications() {
  const translate = useTranslations(NotificationsTranslations);

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
        <div className='mealz-notifications-notification-content'>
          { state.notification?.message ?? ''}
        </div>
        <div className='mealz-notifications-notification-action-bar'>
          { state.notification?.undo &&
            <LinkButton
              label={translate('undo')}
              onClick={state.notification.undo}
            />
          }
        </div>
      </div>
    </div>
  );
}