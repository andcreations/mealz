import * as React from 'react';
import { useState, useEffect } from 'react';

import { Log } from '../../log';
import { LoadStatus } from '../../common';
import { LoaderByStatus, LoaderSize } from '../../components';
import { usePatchState, useService } from '../../hooks';
import { NotificationsService } from '../../notifications';
import { useTranslations } from '../../i18n';
import { GWMacrosWithDayOfWeek, MealsLogService } from '../../meals';
import { MacrosSummaryChart, MacrosSummaryChartData } from '../components';
import { WeeklySummaryTranslations } from './WeeklySummary.translations';


interface WeeklySummaryState {
  summaries?: GWMacrosWithDayOfWeek[];
  loadStatus: LoadStatus;
}

export function WeeklySummary() {
  const notificationsService = useService(NotificationsService);
  const mealsLogService = useService(MealsLogService);
  const translate = useTranslations(WeeklySummaryTranslations);

  const [state, setState] = useState<WeeklySummaryState>({
    loadStatus: LoadStatus.Loading,
  });
  const patchState = usePatchState(setState);

  useEffect(
    () => {
      mealsLogService.fetchWeeklySummary()
        .then((summaries) => {
          patchState({
            summaries,
            loadStatus: LoadStatus.Loaded,
          });
        })
        .catch(error => {
          Log.error('Failed to fetch weekly summary', error);
          notificationsService.error(
            translate('failed-to-fetch-weekly-summary')
          );
          patchState({
            loadStatus: LoadStatus.FailedToLoad,
          });
        });
    },
    [],
  );

  const summariesToChartData = (): MacrosSummaryChartData[] => {
    return state.summaries.map((summary, index) => {
      const isLastDay = index === state.summaries.length - 1;

      return {
        name: index.toString(),
        label: !isLastDay ? summary.dayOfWeek : translate('today'),
        carbs: summary.carbs,
        protein: summary.protein,
        fat: summary.fat,
        calories: summary.calories,
      };
    });
  }

  return (
    <div className='mealz-weekly-summary'>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
      />
      { state.loadStatus === LoadStatus.Loaded &&
        <MacrosSummaryChart data={summariesToChartData()}/>
      }
    </div>
  );
}