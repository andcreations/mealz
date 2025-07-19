import * as React from 'react';
import { useState, useEffect } from 'react';

import { MealPlannerIngredient, MealSummaryResult } from '../../types';
import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { MealCalculator } from '../../services';
import { MealSummaryTranslations } from './MealSummary.translations';

export interface MealSummaryProps {
  status?: string;
  calories?: number;
  ingredients: MealPlannerIngredient[];
}

interface MealSummaryState {
  status: string | null;
  summary?: MealSummaryResult;
}

export function MealSummary(props: MealSummaryProps) {
  const [state, setState] = useState<MealSummaryState>({
    status: null,
    summary: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealSummaryTranslations);

  const mealCalculator = useService(MealCalculator);

  // initialize state
  useEffect(
    () => {
      const summary = mealCalculator.summarize(
        props.calories,
        props.ingredients,
      );
      patchState({
        status: props.status,
        summary: props.ingredients.length > 0 ? summary : undefined,
      });
    },
    [props.ingredients],
  );

  const renderFacts = () => {
    const { summary } = state;
    let row = 1;

    const addFact = (
      amount: number | undefined,
      unit: string,
      name: string,
    ) => {
      if (amount === undefined) {
        return [];
      }
      const styles = (column: string) => ({
        gridRow: row.toString(),
        gridColumn: column,
      });
      row++;

      const key = name.toLowerCase().replace(/ /g, '-');
      return [
        <div
          key={`${key}-amount`}
          className='mealz-meal-summary-facts-amount'
          style={styles('1')}
        >
          { amount.toFixed(0) }
        </div>,
        <div
          key={`${key}-unit`}
          className='mealz-meal-summary-facts-unit'
          style={styles('2')}
        >
          { translate(unit) }
        </div>,
        <div
          key={`${key}-name`}
          style={styles('3')}
        >
          { translate(name) }
        </div>
      ];
    }

    return [
      ...addFact(summary.total.calories, 'kcal', 'calories'),
      ...addFact(summary.total.carbs, 'g', 'carbs'),
      ...addFact(summary.total.totalFat, 'g', 'fat'),
    ];
  };

  return (
    <div className='mealz-meal-summary'>
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