import * as React from 'react';
import { useState, useEffect } from 'react';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanEntry,
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../common';
import { logErrorEvent, logEventAndRethrow } from '../../event-log';
import { usePatchState, useService } from '../../hooks';
import { 
  htmlToReact,
  LoaderByStatus,
  LoaderSize,
  LoaderType,
  MacrosSummary,
} from '../../components';
import { useTranslations } from '../../i18n';
import { IngredientsCrudService } from '../../ingredients';
import { MealsDailyPlanService, MealsLogService } from '../../meals';
import { DailySummaryTranslations } from './DailySummary.translations';
import { PathTo } from '../../routing';
import { eventType } from '../event-log';

export interface DailySummaryProps {
  fromDate: number;
  toDate: number;
}

interface DailySummaryState {
  loadStatus: LoadStatus;
  summary?: GWMacros;
  goals?: GWMealDailyPlanGoals;
  hasDailyPlan: boolean;
}

export function DailySummary(props: DailySummaryProps) {
  const ingredientsCrudService = useService(IngredientsCrudService);
  const mealsLogService = useService(MealsLogService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const translate = useTranslations(DailySummaryTranslations);

  const [state, setState] = useState<DailySummaryState>({
    loadStatus: LoadStatus.Loading,
    hasDailyPlan: false,
  });
  const patchState = usePatchState(setState);
  
  // initial read
  useEffect(
    () => {
      Promise.all([
        logEventAndRethrow(
          () => ingredientsCrudService.waitForIngredientsToLoad(),
          eventType('wait-for-ingredients'),
        ),
        logEventAndRethrow(
          () => mealsLogService.readByDateRange(props.fromDate, props.toDate),
          eventType('meal-log-read'),
        ),
        logEventAndRethrow(
          () => mealsDailyPlanService.readEntriesByNow(),
          eventType('daily-plan-entries-by-now-read'),
        ),
        logEventAndRethrow(
          () => mealsDailyPlanService.readCurrentDailyPlan(),
          eventType('daily-plan-read'),
        ),
      ])
      .then(([_, meals, _dailyPlanEntries, dailyPlan]) => {
        const dailyPlanEntries: GWMealDailyPlanEntry[] = [];

        // if there are meals, take the corresponding daily plan entries
        meals.forEach(meal => {
          const entry = dailyPlan?.entries.find(entry => {
            return entry.mealName === meal.dailyPlanMealName;
          });
          if (entry) {
            dailyPlanEntries.push(entry);
          }
        });

        // if there are no meals, take the first daily plan entry
        const dailyPlanEntry0 = dailyPlan?.entries[0];
        if (dailyPlanEntries.length === 0 && dailyPlanEntry0) {
          dailyPlanEntries.push(dailyPlanEntry0);
        }

        // summarize
        const summary = mealsLogService.summarizeMeals(meals);
        const goals = mealsDailyPlanService.summarizeEntries(dailyPlanEntries);

        patchState({
          loadStatus: LoadStatus.Loaded,
          summary,
          goals,
          hasDailyPlan: !!dailyPlan,
        });
      })
      .catch(error => {
        logErrorEvent(
          eventType('failed-to-initialize-daily-summary'),
          {},
          error,
        );
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
        <>
          <MacrosSummary
            macrosSummary={state.summary}
            goals={state.goals}
          />
          { !state.hasDailyPlan &&
            <div className='mealz-daily-summary-no-daily-plan'>
              { htmlToReact(
                  translate(
                    'no-daily-plan',
                    PathTo.href(PathTo.dailyMealPlan())
                  )
                )
              }
            </div>
          }
        </>
      }
    </div>
  );
}