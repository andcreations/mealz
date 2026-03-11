import * as React from 'react';
import classNames from 'classnames';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { MacrosSummaryBox, MacrosSummaryBoxType } from './MacrosSummaryBox';

export interface MacrosSummaryDetails {
  calories?: string;
  carbs?: string;
  protein?: string;
  fat?: string;
}

export interface MacrosSummaryProps {
  className?: string;
  macrosSummary: GWMacros;
  goals?: GWMealDailyPlanGoals;
  details?: MacrosSummaryDetails;
}

export function MacrosSummary(props: MacrosSummaryProps) {
  const { macrosSummary, goals, details } = props;

  const className = classNames('mealz-macros-summary', props.className);
  return (
    <div className={className}>
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Calories}
        amount={macrosSummary.calories}
        goalFrom={goals?.caloriesFrom}
        goalTo={goals?.caloriesTo}
        unit='kcal'
        details={details?.calories}
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Carbs}
        amount={macrosSummary.carbs}
        goalFrom={goals?.carbsFrom}
        goalTo={goals?.carbsTo}
        unit='g'
        details={details?.carbs}
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Protein}
        amount={macrosSummary.protein}
        goalFrom={goals?.proteinFrom}
        goalTo={goals?.proteinTo}
        unit='g'
        details={details?.protein}
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Fat}
        amount={macrosSummary.fat}
        goalFrom={goals?.fatFrom}
        goalTo={goals?.fatTo}
        unit='g'
        details={details?.fat}
      />
    </div>
  );
}