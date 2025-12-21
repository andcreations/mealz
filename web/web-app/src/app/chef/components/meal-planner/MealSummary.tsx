import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../../common';
import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { UserSettingsService } from '../../../user';
import { MealsDailyPlanService } from '../../../meals';
import { MealPlannerIngredient, MealSummaryResult } from '../../types';
import { MealCalculator } from '../../services';
import { MealSummaryTranslations } from './MealSummary.translations';
import { LoaderByStatus, LoaderSize } from '../../../components';

const MAX_CALORIES_DIFFERENCE = 20;
const GOAL_ERROR_PERCENTAGE = 10;
const SHOW_FAT_DETAILS = false;

export interface MealSummaryProps {
  className?: string;
  status?: string;
  calories?: number;
  ingredients: MealPlannerIngredient[];
}

interface MealSummaryState {
  status: string | null;
  summary?: MealSummaryResult;
  goals?: GWMealDailyPlanGoals;
  loadStatus: LoadStatus;
}

export function MealSummary(props: MealSummaryProps) {
  const userSettings = useService(UserSettingsService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const mealCalculator = useService(MealCalculator);

  const [state, setState] = useState<MealSummaryState>({
    status: null,
    summary: null,
    loadStatus: LoadStatus.Loading,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealSummaryTranslations);

  // initial read
  useEffect(
    () => {
      Promise.all([
        Log.logAndRethrow(
          () => mealsDailyPlanService.readCurrentGoals(),
          'Failed to read current goals',
        ),
      ])
      .then(([goals]) => {
        patchState({
          goals,
          loadStatus: LoadStatus.Loaded,
        });
      });
    },
    [],
  );

  useEffect(
    () => {
      const summary = mealCalculator.summarize(props.ingredients);
      patchState({
        status: props.status,
        summary: props.ingredients.length > 0 ? summary : undefined,
      });
    },
    [props.ingredients],
  );

  const renderFacts = () => {
    const { summary, goals } = state;

    const percentages = mealCalculator.calculateMacrosPercentages(
      summary.total.carbs,
      summary.total.protein,
      summary.total.totalFat,
    );
    const percentageToDetails = (percentage: number) => {
      if (!userSettings.showPercentageInMealSummary()) {
        return undefined;
      }
      return `(${percentage.toFixed(0)}%)`;
    }
    
    let row = 1;
    const nextGridRow = () => {
      return (row++).toString();
    }

    const createFact = (
      amount: number | undefined,
      unit: string,
      nameKey: string,
      options?: {
        tiny?: boolean;
        highlight?: boolean;
        details?: string;
        nameClassName?: string;
      },
    ) => {
      if (amount === undefined) {
        return [];
      }
      const gridRow = nextGridRow();
      const styles = (column: string) => ({
        gridRow,
        gridColumn: column,
      });
      
      const commonClassNames = classNames(
        { 'mealz-font-tiny': options?.tiny },
      );
      const nameClassNames = classNames(
        commonClassNames,
        { 'mealz-error': options?.highlight },
      );

      return [
        <div
          key={`${nameKey}-amount`}
          className={`mealz-meal-summary-facts-amount ${commonClassNames}`}
          style={styles('1')}
        >
          { amount.toFixed(0) }
        </div>,
        <div
          key={`${nameKey}-unit`}
          className={`mealz-meal-summary-facts-unit ${commonClassNames}`}
          style={styles('2')}
        >
          { translate(unit) }
        </div>,
        <div
          className={nameClassNames}
          key={`${nameKey}-name`}
          style={styles('3')}
        >
          <span className={options?.nameClassName}>
            { translate(nameKey) }
          </span>
          { options?.details &&
            <span className='mealz-meal-planner-facts-details'>
              { options.details }
            </span>
          }
        </div>
      ];
    }

    const createSeparator = () => {
      const gridRow = nextGridRow();
      const styles = {
        gridRow,
        gridColumn: '1 / span 3',
      };

      return [
        <div
          key={`row-${gridRow}`}
          className='mealz-meal-summary-separator'
          style={styles}
        >
        </div>
      ];
    }

    const factsIf = (
      condition: boolean,
      createFacts: () => React.ReactNode[],
    ) => {
      return condition ? createFacts() : [];
    }
    const ifDiffersFromGoal = (amount: number, goal: number) => {
      const percent = Math.abs(amount - goal) / goal * 100;
      return percent > GOAL_ERROR_PERCENTAGE;
    }

    const difference = props.calories > 0
      ? summary.total.calories - props.calories
      : undefined;
    let moreThanPlanned: number;
    if (difference > MAX_CALORIES_DIFFERENCE) {
      moreThanPlanned = difference;
    }
    let lessThanPlanned: number;
    if (-difference > MAX_CALORIES_DIFFERENCE) {
      lessThanPlanned = -difference;
    }

    return [
      ...createFact(
        summary.total.calories,
        'kcal',
        'calories',
        {
          nameClassName: 'mealz-color-calories',
        },
      ),
      ...factsIf(
        !!goals,
        () => createFact(
          goals.calories,
          'kcal',
          'calories-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.calories,
              goals.calories,
            ),
          },
        )
      ),      
      ...factsIf(
        moreThanPlanned > 0,
        () => createFact(
          moreThanPlanned,
          'kcal',
          'more-than-planned',
          {
            tiny: true,
            highlight: true,
          },
        )
      ),
      ...factsIf(
        lessThanPlanned > 0,
        () => createFact(
          lessThanPlanned,
          'kcal',
          'less-than-planned',
          {
            tiny: true,
            highlight: true,
          },
        )
      ),

      ...createSeparator(),
      ...createFact(
        summary.total.carbs,
        'g',
        'carbs',
        {
          details: percentageToDetails(percentages.carbs),
          nameClassName: 'mealz-color-carbs',
        },
      ),
      ...factsIf(
        !!goals,
        () => createFact(
          goals.carbs,
          'g',
          'carbs-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.carbs,
              goals.carbs,
            ),
          },
        ),
      ),      
      ...createFact(
        summary.total.sugars,
        'g',
        'sugars',
        {
          tiny: true,
          nameClassName: 'mealz-color-sugars',
        },
      ),

      ...createSeparator(),
      ...createFact(
        summary.total.protein,
        'g',
        'protein',
        {
           details: percentageToDetails(percentages.protein),
           nameClassName: 'mealz-color-protein',
        }
      ),
      ...factsIf(
        !!goals,
        () => createFact(
          goals.protein,
          'g',
          'protein-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.protein,
              goals.protein,
            ),
          },
        )
      ),      

      ...createSeparator(),
      ...createFact(
        summary.total.totalFat,
        'g',
        'fat',
        {
          details: percentageToDetails(percentages.fat),
          nameClassName: 'mealz-color-fat',
        }
      ),
      ...factsIf(
        !!goals,
        () => createFact(
          goals.fat,
          'g',
          'fat-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.totalFat,
              goals.fat,
            ),
          },
        )
      ),

      ...factsIf(
        SHOW_FAT_DETAILS,
        () => [
          ...createFact(
            summary.total.monounsaturatedFat,
            'g',
            'monosaturated-fat',
            { tiny: true },
          ),
          ...createFact(
            summary.total.polyunsaturatedFat,
            'g',
            'polysaturated-fat',
            { tiny: true },
          ),
          ...createFact(
            summary.total.saturatedFat,
            'g',
            'saturated-fat',
            { tiny: true },
          ),
        ]
      ),
    ];
  };

  const mealSummaryClassNames = classNames([
    'mealz-meal-summary',
    props.className,
  ]);

  return (
    <div className={mealSummaryClassNames}>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
      />
      { state.loadStatus === LoadStatus.Loaded &&
        <>
          { !!state.status &&
            <div className='mealz-meal-summary-status'>
              { state.status }
            </div>
          }
          { !state.status && state.summary &&
            <div className='mealz-meal-summary-facts'>
              { renderFacts() }
            </div>
          }
        </>
      }
    </div>
  );
}