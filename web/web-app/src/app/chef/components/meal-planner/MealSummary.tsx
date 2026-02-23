import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { truncateNumber } from '@mealz/backend-shared';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../../common';
import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { UserSettingsService } from '../../../user';
import { isGoalError } from '../../../meals';
import { MealCalculator } from '../../services';
import { MealPlannerIngredient, MealSummaryResult } from '../../types';
import { MealSummaryTranslations } from './MealSummary.translations';
import { LoaderByStatus, LoaderSize } from '../../../components';
import { IngredientsCrudService } from '../../../ingredients';

const MAX_CALORIES_DIFFERENCE = 20;
const SHOW_FAT_DETAILS = false;

export interface MealSummaryProps {
  className?: string;
  status?: string;
  calories?: number;
  ingredients: MealPlannerIngredient[];
  goals?: GWMealDailyPlanGoals;
}

interface MealSummaryState {
  loadStatus: LoadStatus;
  status: string | null;
  summary?: MealSummaryResult;
}

export function MealSummary(props: MealSummaryProps) {
  const userSettings = useService(UserSettingsService);
  const mealCalculator = useService(MealCalculator);
  const ingredientsService = useService(IngredientsCrudService);
  
  const [state, setState] = useState<MealSummaryState>({
    loadStatus: LoadStatus.Loading,
    status: null,
    summary: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealSummaryTranslations);

  // initial read
  useEffect(
    () => {
      Promise.all([
        Log.logAndRethrow(
          () => ingredientsService.waitForIngredientsToLoad(),
          'Failed to wait for ingredients to load',
        ),
      ])
      .then(([_]) => {
        patchState({ loadStatus: LoadStatus.Loaded });
      })
      .catch(() => {
        patchState({ loadStatus: LoadStatus.FailedToLoad });
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
    const { summary } = state;
    const goals: GWMealDailyPlanGoals = {
      caloriesFrom: truncateNumber(props.goals?.caloriesFrom),
      caloriesTo: truncateNumber(props.goals?.caloriesTo),
      proteinFrom: truncateNumber(props.goals?.proteinFrom),
      proteinTo: truncateNumber(props.goals?.proteinTo),
      carbsFrom: truncateNumber(props.goals?.carbsFrom),
      carbsTo: truncateNumber(props.goals?.carbsTo),
      fatFrom: truncateNumber(props.goals?.fatFrom),
      fatTo: truncateNumber(props.goals?.fatTo),
    }

    const percentages = mealCalculator.calculateMacrosPercentages(
      summary.total.carbs,
      summary.total.protein,
      summary.total.totalFat,
    );
    const percentageToDetails = (percentage: number) => {
      if (!userSettings.showPercentageInMealSummary()) {
        return undefined;
      }
      const percentageToShow = truncateNumber(percentage);
      return `(${percentageToShow.toFixed(0)}%)`;
    }

    const goalFactAmount = (from?: number, to?: number) => {
      if (!from || !to) {
        return undefined;
      }
      return `${from.toFixed(0)}-${to.toFixed(0)}`;
    }
    
    let row = 1;
    const nextGridRow = () => {
      return (row++).toString();
    }

    const createFact = (
      amount: string | number | undefined,
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
      if (typeof amount === 'number') {
        amount = truncateNumber(amount).toString();
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
          { amount }
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
    const ifDiffersFromGoal = (
      amount: number,
      goalFrom: number,
      goalTo: number,
    ) => {
      return isGoalError(amount, goalFrom, goalTo);
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
          goalFactAmount(goals.caloriesFrom, goals.caloriesTo),
          'kcal',
          'calories-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.calories,
              goals.caloriesFrom,
              goals.caloriesTo,
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
          goalFactAmount(goals.carbsFrom, goals.carbsTo),
          'g',
          'carbs-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.carbs,
              goals.carbsFrom,
              goals.carbsTo,
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
          goalFactAmount(goals.proteinFrom, goals.proteinTo),
          'g',
          'protein-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.protein,
              goals.proteinFrom,
              goals.proteinTo,
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
          goalFactAmount(goals.fatFrom, goals.fatTo),
          'g',
          'fat-goal',
          {
            tiny: true,
            highlight: ifDiffersFromGoal(
              summary.total.totalFat,
              goals.fatFrom,
              goals.fatTo,
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
      { state.loadStatus !== LoadStatus.Loaded &&
        <div className='mealz-meal-summary-loader'>
          <LoaderByStatus
            loadStatus={state.loadStatus}
            size={LoaderSize.Small}
          />
        </div>
      }
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