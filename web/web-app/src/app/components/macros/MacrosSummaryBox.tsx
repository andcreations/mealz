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
  goalFrom?: number;
  goalTo?: number;
  unit: string;
}

export function MacrosSummaryBox(props: MacrosSummaryBoxProps) {
  const { type, amount, goalFrom, goalTo, unit } = props;
  const translate = useTranslations(MacrosSummaryBoxTranslations);

  let goalError = false;
  if (goalFrom && goalTo && amount > 0) {
    goalError = amount < goalFrom || amount > goalTo;
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

  const hasGoal = !!goalFrom && !!goalTo;
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
      { hasGoal &&
        <>
          <div className={goalLabelClassName}>
            {translate('goal')}
          </div>
          <div className='mealz-macros-summary-box-goal-container'>
            <span className='mealz-macros-summary-box-goal'>
              {goalFrom.toFixed(0)}-{goalTo.toFixed(0)}
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