import * as React from 'react';
import { useState, useEffect } from 'react';
import { GWMealLog } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlan,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../common';
import { Log } from '../../log';
import { usePatchState, useService } from '../../hooks';
import { LoaderByStatus, LoaderSize } from '../../components';
import { MealsDailyPlanService, MealsLogService } from '../../meals';
import { NotificationsService } from '../../notifications';
import { useTranslations } from '../../i18n';
import { MealLog, MealLogProps } from '../components';
import { DailyMealsLogTranslations } from './DailyMealsLog.translations';

export interface DailyMealsLogProps {
  fromDate: number;
  toDate: number;
}

interface DailyMealsLogState {
  meals?: GWMealLog[];
  mealDailyPlan?: GWMealDailyPlan;
  loadStatus: LoadStatus;
}

export function DailyMealsLog(props: DailyMealsLogProps) {
  const mealsLogService = useService(MealsLogService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const notificationsService = useService(NotificationsService);
  const translate = useTranslations(DailyMealsLogTranslations);

  const [state, setState] = useState<DailyMealsLogState>({
    loadStatus: LoadStatus.Loading,
  });
  const patchState = usePatchState(setState);
  
  // initial read
  useEffect(
    () => {
      Promise.all([
        Log.logAndRethrow(
          () => mealsLogService.readByDateRange(props.fromDate, props.toDate),
          'Failed to summarize daily meal log',
        ),
        Log.logAndRethrow(
          () => mealsDailyPlanService.readCurrentDailyPlan(),
          'Failed to read current daily plan',
        ),
      ])
      .then(([meals, mealDailyPlan]) => {
        patchState({
          meals,
          mealDailyPlan,
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
  
  const renderMealLogs = () => {
    const mealDailyPlanEntries = state.mealDailyPlan?.entries ?? [];
    const mealLogs = [];

    // render from the daily plan
    mealDailyPlanEntries.forEach(entry => {
      const mealLog = state.meals?.find(meal => {
        return meal.dailyPlanMealName === entry.mealName;
      });


      if (mealLog) {
        mealLogs.push(
          <MealLog
            key={mealLog.id}
            mealName={entry.mealName}
            meal={mealLog.meal}
            mealDailyPlanEntry={entry}
          />
        );
      }
      else {
        mealLogs.push(
          <MealLog
            key={entry.mealName}
            mealName={entry.mealName}
          />
        );
      }
    });


    // render from the meals
    (state.meals ?? []).forEach(mealLog => {
      const hasDailyPlanMealName = mealDailyPlanEntries.some(entry => {
        return entry.mealName === mealLog.dailyPlanMealName;
      });
      if (!hasDailyPlanMealName) {
        mealLogs.push(
          <MealLog
            key={mealLog.id}
            mealName={mealLog.dailyPlanMealName ?? 'Unknown'}
            meal={mealLog.meal}
          />
        );
      }
    });

    return mealLogs;
  };

  return (
    <div className='mealz-daily-meals-log'>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
      />
      { state.loadStatus === LoadStatus.Loaded &&
        renderMealLogs()
      }
    </div>
  );
}