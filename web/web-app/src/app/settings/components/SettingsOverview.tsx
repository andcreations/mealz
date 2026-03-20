import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GWUserInfo } from '@mealz/backend-users-crud-gateway-api';

import { logEventAndRethrow, logErrorEvent } from '../../event-log';
import { LoadStatus } from '../../common';
import { PathTo } from '../../routing';
import { usePatchState, useService } from '../../hooks';
import { AuthService } from '../../auth';
import { UserService } from '../../user';
import { useTranslations } from '../../i18n';
import { 
  LoaderByStatus, 
  LoaderSize, 
  LoaderType, 
  MaterialIcon,
} from '../../components';
import { eventType } from '../event-log';
import { SettingsOverviewTranslations } from './SettingsOverview.translations';
import { SettingsMenu } from './SettingsMenu';
import { GoToSettingsMenuItem } from './GoToSettingsMenuItem';

interface SettingsOverviewState {
  loadStatus: LoadStatus;
  userInfo?: GWUserInfo;
}

export function SettingsOverview() {
  const translate = useTranslations(SettingsOverviewTranslations);
  const authService = useService(AuthService);
  const userService = useService(UserService);
  const navigate = useNavigate();

  const [state, setState] = React.useState<SettingsOverviewState>({
    loadStatus: LoadStatus.Loading,
  });
  const patchState = usePatchState(setState);

  // initial read
  useEffect(() => {
    logEventAndRethrow(
      () => userService.readCurrentUserV1(),
      eventType('user-read'),
    ).then(({ userInfo }) => {
      patchState({ loadStatus: LoadStatus.Loaded, userInfo });
    }).catch((error) => {
      logErrorEvent(eventType('failed-to-read-current-user'), {}, error);
      patchState({ loadStatus: LoadStatus.FailedToLoad });
    });
  }, []);

  const onHydrationDailyMealClick = () => {
    navigate(PathTo.hydrationDailyPlan());
  };

  const onDailyMealPlanClick = () => {
    navigate(PathTo.dailyMealPlan());
  };

  const onTelegramSettingsClick = () => {
    navigate(PathTo.telegramSettings());
  };

  const onCalculatorSettingsClick = () => {
    navigate(PathTo.calculatorSettings());
  };

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
  };

  const onSignOut = () => {
    authService.signOutOrLogError();
    navigate(PathTo.signIn());
  };

  return (
    <>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
        type={loader.type()}
        subTitle={loader.subTitle()}
      />
      { state.loadStatus === LoadStatus.Loaded &&
        <div className='mealz-settings-overview'>
          <div className='mealz-settings-overview-user-info'>
            <MaterialIcon
              className='mealz-settings-overview-user-info-icon'
              icon='person'
            />
            <div className='mealz-settings-overview-user-info-name'>
              { state.userInfo?.firstName }
            </div>
            <div className='mealz-settings-overview-user-info-email'>
              { state.userInfo?.email }
            </div>
          </div>

          <div className='mealz-settings-overview-separator'></div>
          <SettingsMenu>
            <GoToSettingsMenuItem
              icon='water_drop'
              label={translate('hydration-daily-plan')}
              onClick={onHydrationDailyMealClick}
            />
            <GoToSettingsMenuItem
              icon='view_agenda'
              label={translate('daily-meal-plan')}
              onClick={onDailyMealPlanClick}
            />
            <GoToSettingsMenuItem
              icon='send'
              label={translate('telegram')}
              onClick={onTelegramSettingsClick}
            />
            <GoToSettingsMenuItem
              icon='calculate'
              label={translate('calculator')}
              onClick={onCalculatorSettingsClick}
            />
          </SettingsMenu>

          <div className='mealz-settings-overview-separator'></div>
          <div
            className='mealz-settings-overview-sign-out'
            onClick={onSignOut}
          >
            <MaterialIcon
              className='mealz-settings-overview-sign-out-icon'
              icon='power_settings_new'
            />
            <div className='mealz-settings-overview-sign-out-label'>
              { translate('sign-out') }
            </div>
          </div>
        </div>
      }
    </>
  );
}