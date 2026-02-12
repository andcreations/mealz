import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { PathTo } from '../../routing';
import { useService } from '../../hooks';
import { AuthService } from '../../auth';
import { useTranslations } from '../../i18n';
import { MaterialIcon } from '../../components';
import { SettingsOverviewTranslations } from './SettingsOverview.translations';
import { SettingsMenu } from './SettingsMenu';
import { GoToSettingsMenuItem } from './GoToSettingsMenuItem';

export function SettingsOverview() {
  const translate = useTranslations(SettingsOverviewTranslations);
  const authService = useService(AuthService);
  const navigate = useNavigate();

  const onHydrationDailyMealClick = () => {
    navigate(PathTo.hydrationDailyPlan());
  };

  const onDailyMealPlanClick = () => {
    navigate(PathTo.dailyMealPlan());
  };

  const onTelegramSettingsClick = () => {
    navigate(PathTo.telegramSettings());
  };

  const onSignOut = () => {
    authService.signOutOrLogError();
    navigate(PathTo.signIn());
  };

  return (
    <div className='mealz-settings-overview'>
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