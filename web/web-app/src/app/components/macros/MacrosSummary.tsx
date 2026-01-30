import * as React from 'react';
import classNames from 'classnames';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { MacrosSummaryBox, MacrosSummaryBoxType } from './MacrosSummaryBox';

export interface MacrosSummaryProps {
  className?: string;
  macrosSummary: GWMacros;
  goals?: GWMealDailyPlanGoals;
}

export function MacrosSummary(props: MacrosSummaryProps) {
  const className = classNames('mealz-macros-summary', props.className);
  return (
    <div className={className}>
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Calories}
        amount={props.macrosSummary.calories}
        goalFrom={props.goals?.caloriesFrom}
        goalTo={props.goals?.caloriesTo}
        unit='kcal'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Carbs}
        amount={props.macrosSummary.carbs}
        goalFrom={props.goals?.carbsFrom}
        goalTo={props.goals?.carbsTo}
        unit='g'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Protein}
        amount={props.macrosSummary.protein}
        goalFrom={props.goals?.proteinFrom}
        goalTo={props.goals?.proteinTo}
        unit='g'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Fat}
        amount={props.macrosSummary.fat}
        goalFrom={props.goals?.fatFrom}
        goalTo={props.goals?.fatTo}
        unit='g'
      />
    </div>
  );
}