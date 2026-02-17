import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { SystemService } from '../../../system';
import { MacrosSummary, MaterialIcon } from '../../../components';
import {
  MealDailyPlanSummaryTranslations,
} from './MealDailyPlanSummary.translations';

export interface MealDailyPlanSummaryProps {
  macrosSummary: GWMacros;
  forNotification?: boolean;
}

interface MealDailyPlanSummaryState {
  isOpen: boolean;
}

export function MealDailyPlanSummary(props: MealDailyPlanSummaryProps) {
  const translate = useTranslations(MealDailyPlanSummaryTranslations);
  const systemService = useService(SystemService);
  const isMobile = systemService.isMobile();

  const [state, setState] = useState<MealDailyPlanSummaryState>({
    isOpen: true,
  });
  const patchState = usePatchState(setState);

  const summaryClassName = classNames(
    'mealz-meal-daily-plan-summary',
    {
      'mealz-meal-daily-plan-summary-mobile': isMobile,
      'mealz-meal-daily-plan-summary-desktop': !isMobile,
      'mealz-meal-daily-plan-summary-for-notification': props.forNotification,
    }
  );

  const topBar = {
    icon: () => {
      return state.isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right';
    },

    onClick: () => {
      patchState({
        isOpen: !state.isOpen,
      });
    },
  }

  return (
    <div className={summaryClassName}>
      <div
        className='mealz-meal-daily-plan-summary-top-bar'
        onClick={topBar.onClick}
      >
        <div>{ translate('title') }</div>
        <MaterialIcon
          className='mealz-meal-daily-plan-summary-top-bar-icon'
          icon={topBar.icon()}
        />
      </div>
      { state.isOpen &&
        <div className='mealz-meal-daily-plan-summary-content'>
          <MacrosSummary macrosSummary={props.macrosSummary}/>
        </div>
      }
    </div>
  );
}