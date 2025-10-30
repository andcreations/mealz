import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { MealPlannerIngredient, MealSummaryResult } from '../../types';
import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { UserSettingsService } from '../../../user';
import { MealCalculator } from '../../services';
import { MealSummaryTranslations } from './MealSummary.translations';

const MAX_CALORIES_DIFFERENCE = 20;

export interface MealSummaryProps {
  className?: string;
  status?: string;
  calories?: number;
  ingredients: MealPlannerIngredient[];
}

interface MealSummaryState {
  status: string | null;
  summary?: MealSummaryResult;
}

export function MealSummary(props: MealSummaryProps) {
  const userSettings = useService(UserSettingsService);
  const mealCalculator = useService(MealCalculator);

  const [state, setState] = useState<MealSummaryState>({
    status: null,
    summary: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealSummaryTranslations);

  // initialize state
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

    const addFact = (
      amount: number | undefined,
      unit: string,
      nameKey: string,
      options?: {
        tiny?: boolean;
        highlight?: boolean;
        details?: string;
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
          <span>
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

    const addSeparator = () => {
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

    const factsIf = (condition: boolean, facts: any[]) => {
      return condition ? facts : [];
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
      ...addFact(summary.total.calories, 'kcal', 'calories'),
      ...factsIf(
        moreThanPlanned > 0,
        addFact(
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
        addFact(
          lessThanPlanned,
          'kcal',
          'less-than-planned',
          {
            tiny: true,
            highlight: true,
          },
        )
      ),

      ...addSeparator(),
      ...addFact(
        summary.total.carbs,
        'g',
        'carbs',
        {
          details: percentageToDetails(percentages.carbs)
        }),
      ...addFact(summary.total.sugars, 'g', 'sugars', { tiny: true }),
      ...addSeparator(),
      ...addFact(
        summary.total.protein,
        'g',
        'protein',
        {
           details: percentageToDetails(percentages.protein) 
        }
      ),
      ...addSeparator(),
      ...addFact(
        summary.total.totalFat,
        'g',
        'fat',
        {
          details: percentageToDetails(percentages.fat)
        }
      ),
      ...addFact(
        summary.total.monounsaturatedFat,
        'g',
        'monosaturated-fat',
        { tiny: true },
      ),
      ...addFact(
        summary.total.polyunsaturatedFat,
        'g',
        'polysaturated-fat',
        { tiny: true },
      ),
      ...addFact(
        summary.total.saturatedFat,
        'g',
        'saturated-fat',
        { tiny: true },
      ),
    ];
  };

  const mealSummaryClassNames = classNames([
    'mealz-meal-summary',
    props.className,
  ]);

  return (
    <div className={mealSummaryClassNames}>
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
    </div>
  );
}