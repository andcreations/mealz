import * as React from 'react';
import { useState, useEffect } from 'react';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../common';
import { Log } from '../../log';
import { usePatchState, useService } from '../../hooks';
import { 
  LoaderByStatus,
  LoaderSize,
  LoaderType,
  MacrosSummary,
} from '../../components';
import { useTranslations } from '../../i18n';
import { IngredientsCrudService } from '../../ingredients';
import { MealsDailyPlanService, MealsLogService } from '../../meals';
import { DailySummaryTranslations } from './DailySummary.translations';

export interface DailySummaryProps {
  fromDate: number;
  toDate: number;
}

interface DailySummaryState {
  summary?: GWMacros;
  goals?: GWMealDailyPlanGoals;
  loadStatus: LoadStatus;
}

export function DailySummary(props: DailySummaryProps) {
  const ingredientsCrudService = useService(IngredientsCrudService);
  const mealsLogService = useService(MealsLogService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
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
          () => ingredientsCrudService.waitForIngredientsToLoad(),
          'Failed to wait for ingredients to load',
        ),
        Log.logAndRethrow(
          () => mealsLogService.readByDateRange(props.fromDate, props.toDate),
          'Failed to read daily meal log',
        ),
        Log.logAndRethrow(
          () => mealsDailyPlanService.readEntriesByNow(),
          'Failed to read current daily plan entries',
        ),
      ])
      .then(([_, meals, dailyPlanEntries]) => {
        const lastEntry = dailyPlanEntries[dailyPlanEntries.length - 1];
        if (lastEntry) {
          const hasLastMeal = meals.some(meal => {
            return meal.dailyPlanMealName === lastEntry.mealName;
          });
          if (!hasLastMeal) {
            dailyPlanEntries.pop();
          }
        }

        const summary = mealsLogService.summarizeMeals(meals);
        const goals = mealsDailyPlanService.summarizeEntries(dailyPlanEntries);

        patchState({
          summary,
          goals,
          loadStatus: LoadStatus.Loaded,
        });
      })
      .catch(error => {
        Log.error('Failed to summarize daily meal log', error);
        patchState({
          loadStatus: LoadStatus.FailedToLoad,
        });
      });
    },
    [],
  );

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

  return (
    <div className='mealz-daily-summary'>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
        type={loader.type()}
        subTitle={loader.subTitle()}
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