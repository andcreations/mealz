import * as React from 'react';
import { useState, useEffect } from 'react';
import { GWMacrosSummary } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../common';
import { Log } from '../../log';
import { usePatchState, useService } from '../../hooks';
import { LoaderByStatus, LoaderSize } from '../../components';
import { NotificationsService } from '../../notifications';
import { useTranslations } from '../../i18n';
import { MealsDailyPlanService, MealsLogService } from '../../meals';
import { MacrosSummary } from '../components';
import { DailySummaryTranslations } from './DailySummary.translations';

export interface DailySummaryProps {
  fromDate: number;
  toDate: number;
}

interface DailySummaryState {
  summary?: GWMacrosSummary;
  goals?: GWMealDailyPlanGoals;
  loadStatus: LoadStatus;
}

export function DailySummary(props: DailySummaryProps) {
  const mealsLogService = useService(MealsLogService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const notificationsService = useService(NotificationsService);
  const translate = useTranslations(DailySummaryTranslations);

  const [state, setState] = useState<DailySummaryState>({
    loadStatus: LoadStatus.Loading,
  });
  const patchState = usePatchState(setState);
  
  // initial read
  useEffect(
    () => {
      Promise.all([
        Log.logAndRethrow(
          () => mealsLogService.summarize(props.fromDate, props.toDate),
          'Failed to summarize daily meal log',
        ),
        Log.logAndRethrow(
          () => mealsDailyPlanService.readCurrentDailyGoals(),
          'Failed to read current daily plan',
        ),
      ])
      .then(([summary, goals]) => {
        patchState({
          summary,
          goals,
          loadStatus: LoadStatus.Loaded,
        });
      })
      .catch(error => {
        Log.error('Failed to summarize daily meal log', error);
        notificationsService.error(
          translate('failed-to-load-meal-log-summary')
        );
        patchState({
          loadStatus: LoadStatus.FailedToLoad,
        });
      });
    },
    [],
  );

  return (
    <div className='mealz-daily-summary'>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
      />
      { state.loadStatus === LoadStatus.Loaded &&
        <MacrosSummary
          macrosSummary={state.summary}
          goals={state.goals}
        />
      }
    </div>
  );
}