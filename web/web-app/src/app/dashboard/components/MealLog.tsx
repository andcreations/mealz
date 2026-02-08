import * as React from 'react';
import { useRef } from 'react';
import classNames from 'classnames';
import { truncateNumber } from '@mealz/backend-shared';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import { 
  GWMealDailyPlanEntry,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { useTranslations } from '../../i18n';
import { useService } from '../../hooks';
import { GWMealCalculator, isGoalError } from '../../meals';
import { MealLogTranslations } from './MealLog.translations';

export interface MealLogProps {
  mealName: string;
  meal?: GWMealWithoutId;
  mealDailyPlanEntry?: GWMealDailyPlanEntry;
}

export function MealLog(props: MealLogProps) {
  const { meal, mealDailyPlanEntry } = props;
  const goals = mealDailyPlanEntry?.goals;

  const gwMealCalculator = useService(GWMealCalculator);
  const translate = useTranslations(MealLogTranslations);

  const gwMacros = useRef<GWMacros | undefined>(
    meal ? gwMealCalculator.calculateMacros(props.meal) : undefined,
  );

  const renderFact = (
    factKey: string,
    value: number,
    unit: string,
    goalFrom?: number,
    goalTo?: number,
  ) => {
    const nameClassNames = classNames(
      'mealz-meal-log-fact-name',
      `mealz-color-${factKey}`,
    );
    const separatorClassName = classNames(
      'mealz-meal-log-fact-separator',
      `mealz-meal-log-fact-separator-${factKey}`,
    );
    const goalError = isGoalError(
      truncateNumber(value),
      truncateNumber(goalFrom),
      truncateNumber(goalTo),
    );
    const goalLabelClassName = classNames(
      'mealz-meal-log-fact-goal-label',
      { 'mealz-meal-log-fact-goal-error': goalError },
    );

    return (
      <div className='mealz-meal-log-fact'>
        <div className={nameClassNames}>
          { translate(factKey) }
        </div>
        <div className={separatorClassName}></div>
        <div className='mealz-meal-log-fact-value'>
          <span>{ truncateNumber(value).toFixed() }</span>
          <span className='mealz-meal-log-fact-unit'>{ unit }</span>
        </div>
        { goalFrom && goalTo &&
          <>
            <div className={goalLabelClassName}>
              { translate('goal') }
            </div>
            <div className='mealz-meal-log-fact-goal-value'>
              <span>{ goalFrom.toFixed(0)}-{goalTo.toFixed(0) }</span>
              <span className='mealz-meal-log-fact-unit'>{ unit }</span>
            </div>
          </>
        }
      </div>
    );
  };

  const renderFacts = () => {
    return (
      <>
        { renderFact(
            'calories',
            gwMacros.current.calories,
            'kcal',
            goals?.caloriesFrom,
            goals?.caloriesTo,
          )
        }
        { renderFact(
            'carbs',
            gwMacros.current.carbs,
            'g',
            goals?.carbsFrom,
            goals?.carbsTo,
          )
        }
        { renderFact(
            'protein',
            gwMacros.current.protein,
            'g',
            goals?.proteinFrom,
            goals?.proteinTo,
          )
        }
        { renderFact(
            'fat',
            gwMacros.current.fat,
            'g',
            goals?.fatFrom,
            goals?.fatTo,
          )
        }
      </>
    );
  };

  const hasFacts = gwMacros.current !== undefined;
  
  return (
    <div className='mealz-meal-log'>
      <div className='mealz-meal-log-name'>
        { props.mealName }
      </div>
      { hasFacts &&
        <div className='mealz-meal-log-facts'>
          { renderFacts() }
        </div>
      }
      { !hasFacts &&
        <div className='mealz-meal-log-fact-no-meal'>
          { translate('not-yet-logged') }
        </div>
      }
    </div>
  );
}