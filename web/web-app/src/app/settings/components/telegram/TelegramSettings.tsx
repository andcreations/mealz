import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { GWTelegramUser } from '@mealz/backend-telegram-users-gateway-api';

import { logErrorEvent, logEventAndRethrow } from '../../../event-log';
import { LoadStatus } from '../../../common';
import { useTranslations } from '../../../i18n';
import { 
  FullScreenLoader,
  htmlToReact,
  LoaderByStatus,
  LoaderSize,
  LoaderType,
} from '../../../components';
import { usePatchState, useService } from '../../../hooks';
import { TelegramService } from '../../../telegram';
import { NotificationsService } from '../../../notifications';
import { eventType } from '../../event-log';
import { SettingsSection } from '../SettingsSection';
import { SwitchSetting } from '../SwitchSetting';
import { TelegramSettingsTranslations } from './TelegramSettings.translations';

interface TelegramSettingsState {
  loadStatus: LoadStatus;
  updatingNotificationsEnabled: boolean;
  refreshing: boolean;
  telegramUser?: GWTelegramUser;
  startLink?: string;
}

export function TelegramSettings() {
  const translate = useTranslations(TelegramSettingsTranslations);
  const telegramService = useService(TelegramService);
  const notificationsService = useService(NotificationsService);
  
  const [state, setState] = useState<TelegramSettingsState>({
    loadStatus: LoadStatus.Loading,
    updatingNotificationsEnabled: false,
    refreshing: false,
  });
  const patchState = usePatchState(setState);

  // initial read
  useEffect(
    () => {
      logEventAndRethrow(
        () => telegramService.readTelegramUser(),
        eventType('telegram-user-read'),
      ).then(telegramUser => {
        // if user's account is already linked...
        if (telegramUser) {
          patchState({
            loadStatus: LoadStatus.Loaded,
            telegramUser,
          });
          return;
        }
        
        // ...otherwise generate start link
        logEventAndRethrow(
          () => telegramService.generateStartLink(),
          eventType('telegram-start-link-generate'),
        ).then(startLink => {
          patchState({
            loadStatus: LoadStatus.Loaded,
            startLink,
          });
        });
      })
      .catch(error => {
        logErrorEvent(eventType('failed-to-read-telegram-user'), {}, error);
        patchState({ loadStatus: LoadStatus.FailedToLoad });
      });
    },
    [],
  );

  const telegramUser = {
    onEnableNotifications: (enabled: boolean) => {
      if (state.telegramUser.isEnabled === enabled) {
        return;
      }
      patchState({ updatingNotificationsEnabled: true });
      logEventAndRethrow(
        () => telegramService.patchTelegramUser({ isEnabled: enabled }),
        eventType('telegram-user-patch'),
      )
      .then(() => {
        notificationsService.info(translate('notifications-enabled'));
        setState(prevState => ({
          ...prevState,
          updatingNotificationsEnabled: false,
          telegramUser: {
            ...prevState.telegramUser,
            isEnabled: enabled,
          },
        }));
      })
      .catch(error => {
        logErrorEvent(eventType('failed-to-patch-telegram-user'), {}, error);
        notificationsService.error('failed-to-enable-notifications');
        patchState({ updatingNotificationsEnabled: false });
      });
    },
  };

  const link = {
    onLink: () => {
      window.open(state.startLink, '_blank', 'noopener,noreferrer');
    },

    onRefresh: () => {
      patchState({ refreshing: true });
      logEventAndRethrow(
        () => telegramService.readTelegramUser(),
        eventType('telegram-user-read'),
      ).then(telegramUser => {
        if (telegramUser) {
          patchState({
            refreshing: false,
            telegramUser,
            startLink: undefined,
          });
          return;
        }
        patchState({ refreshing: false });
        notificationsService.info(
          translate('account-not-linked-after-refresh'),
        );
      })
      .catch(error => {
        logErrorEvent(eventType('failed-to-read-telegram-user'), {}, error);
        patchState({ refreshing: false });
        notificationsService.error(translate('failed-to-refresh'));
      })
    },
  }

  const loader = {
    type: () => {
      return state.loadStatus === LoadStatus.FailedToLoad
        ? LoaderType.Error
        : LoaderType.Info;
    },
    subTitle: () => {
      return state.loadStatus === LoadStatus.FailedToLoad
        ? translate('failed-to-load')
        : undefined;
    },
  }
  const isLoaded = state.loadStatus === LoadStatus.Loaded;
  const updating = state.updatingNotificationsEnabled || state.refreshing;

  return (
    <>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
        type={loader.type()}
        subTitle={loader.subTitle()}
      />
      { updating &&
        <FullScreenLoader
          size={LoaderSize.Small}
          title={translate('taking-longer')}
        />
      }
      <SettingsSection>
        { (isLoaded && !!state.telegramUser) &&
          <div className='mealz-telegram-settings-user'>
            { htmlToReact(translate(
                'account-linked',
                state.telegramUser.telegramUsername
              ))
            }
            <SwitchSetting
              label={ translate('enable-notifications-label') }
              details={ translate('enable-notifications-details') }
              checked={state.telegramUser.isEnabled}
              disabled={state.updatingNotificationsEnabled}
              onChange={telegramUser.onEnableNotifications}
            />
          </div>
        }
        { (isLoaded && !!state.startLink) &&
          <div className='mealz-telegram-settings-start-link'>
            <div className='mealz-telegram-settings-start-link-text'>
              { htmlToReact(translate('account-not-linked')) }
            </div>
            <Button
              size='sm'
              onClick={link.onLink}
            >
              { translate('link') }
            </Button>
            <div className='mealz-telegram-settings-start-link-refresh-info'>
              { translate('refresh-info') }
            </div>
            <Button
              size='sm'
              variant='secondary'
              disabled={state.refreshing}
              onClick={link.onRefresh}
            >
              { translate('refresh') }
            </Button>
          </div>
        }
      </SettingsSection>
    </>
  );
}