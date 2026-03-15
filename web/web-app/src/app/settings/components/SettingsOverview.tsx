import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GWUserInfo } from '@mealz/backend-users-crud-gateway-api';

import { Log } from '../../log';
import { PathTo } from '../../routing';
import { usePatchState, useService } from '../../hooks';
import { AuthService } from '../../auth';
import { UserService } from '../../user';
import { useTranslations } from '../../i18n';
import { MaterialIcon } from '../../components';
import { SettingsOverviewTranslations } from './SettingsOverview.translations';
import { SettingsMenu } from './SettingsMenu';
import { GoToSettingsMenuItem } from './GoToSettingsMenuItem';

interface SettingsOverviewState {
  userInfo?: GWUserInfo;
}

export function SettingsOverview() {
  const translate = useTranslations(SettingsOverviewTranslations);
  const authService = useService(AuthService);
  const userService = useService(UserService);
  const navigate = useNavigate();

  const [state, setState] = React.useState<SettingsOverviewState>({});
  const patchState = usePatchState(setState);

  // initial read
  useEffect(() => {
    Log.logAndRethrow(
      () => userService.readCurrentUserV1(),
      'user-read-in-settings-overview',
    ).then(({ userInfo }) => {
      patchState({ userInfo });
    }).catch((error) => {
      Log.error('Failed to read current user', error);
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

  const onSignOut = () => {
    authService.signOutOrLogError();
    navigate(PathTo.signIn());
  };

  return (
    <div className='mealz-settings-overview'>
      <div className='mealz-settings-overview-user-info'>

      </div>
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

      <div className='mealz-settings-overview-sign-out-separator'></div>
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
  );
}