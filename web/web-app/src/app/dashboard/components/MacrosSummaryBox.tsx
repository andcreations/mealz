import * as React from 'react';
import classNames from 'classnames';

import { useTranslations } from '../../i18n';
import { MacrosSummaryBoxTranslations } from './MacrosSummaryBox.translations';

export enum MacrosSummaryBoxType {
  Calories = 'calories',
  Carbs = 'carbs',
  Protein = 'protein',
  Fat = 'fat',
}

export interface MacrosSummaryBoxProps {
  type: MacrosSummaryBoxType;
  amount: number;
  goal?: number;
  unit: string;
}

const GOAL_ERROR_PERCENTAGE = 10;

export function MacrosSummaryBox(props: MacrosSummaryBoxProps) {
  const { type, amount, goal, unit } = props;
  const translate = useTranslations(MacrosSummaryBoxTranslations);

  // TODO How to display the difference between the amount and the goal?
  const sign = (value: number) => {
    if (value === 0) {
      return '';
    }
    return value > 0 ? '+' : '';
  }
  const toGoal = goal ? goal - amount : undefined;
  const toGoalStr = toGoal
    ? sign(toGoal) + toGoal.toFixed(0)
    : undefined;

  let goalError = false;
  if (goal && amount > 0) {
    const toGoalPercent = Math.abs((goal - amount) / goal * 100);
    goalError = toGoalPercent > GOAL_ERROR_PERCENTAGE;
  }
  if (amount === 0) {
    goalError = true;
  }

  const isType = (expectedType: MacrosSummaryBoxType) => {
    return type === expectedType;
  }
  const nameClassNames = classNames(
    'mealz-macros-summary-box-name',
    {
      'mealz-color-calories': isType(MacrosSummaryBoxType.Calories),
      'mealz-color-carbs': isType(MacrosSummaryBoxType.Carbs),
      'mealz-color-protein': isType(MacrosSummaryBoxType.Protein),
      'mealz-color-fat': isType(MacrosSummaryBoxType.Fat),
    },
  );
  const separatorClassNames = classNames(
    'mealz-macros-summary-separator',
    {
      'mealz-macros-summary-separator-calories':
        isType(MacrosSummaryBoxType.Calories),
      'mealz-macros-summary-separator-carbs':
        isType(MacrosSummaryBoxType.Carbs),
      'mealz-macros-summary-separator-protein':
        isType(MacrosSummaryBoxType.Protein),
      'mealz-macros-summary-separator-fat':
        isType(MacrosSummaryBoxType.Fat),
    },
  );

  const goalLabelClassName = classNames(
    'mealz-macros-summary-box-goal-label',
    { 'mealz-macros-summary-box-goal-label-error': goalError }
  );
  
  return (
    <div className='mealz-macros-summary-box'>
      <div className={nameClassNames}>
        {translate(type)}
      </div>
      <div className={separatorClassNames}></div>
      <div className='mealz-macros-summary-box-amount-container'>
        <span className='mealz-macros-summary-box-amount'>
          {amount.toFixed(0)}
        </span>
        <span className='mealz-macros-summary-box-unit'>
          {unit}
        </span>
      </div>
      { goal &&
        <>
          <div className={goalLabelClassName}>
            {translate('goal')}
          </div>
          <div className='mealz-macros-summary-box-goal-container'>
            <span className='mealz-macros-summary-box-goal'>
              {goal.toFixed(0)}
            </span>
            <span className='mealz-macros-summary-box-unit'>
              {unit}
            </span>
          </div>
        </>
      }
    </div>
  );
}