import * as React from 'react';
import { GWMacrosSummary } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { MacrosSummaryBox, MacrosSummaryBoxType } from './MacrosSummaryBox';

export interface MacrosSummaryProps {
  macrosSummary: GWMacrosSummary;
  goals?: GWMealDailyPlanGoals;
}

export function MacrosSummary(props: MacrosSummaryProps) {
  return (
    <div className='mealz-macros-summary'>
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Calories}
        amount={props.macrosSummary.calories}
        goal={props.goals?.calories}
        unit='kcal'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Carbs}
        amount={props.macrosSummary.carbs}
        goal={props.goals?.carbs}
        unit='g'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Protein}
        amount={props.macrosSummary.protein}
        goal={props.goals?.protein}
        unit='g'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Fat}
        amount={props.macrosSummary.fat}
        goal={props.goals?.fat}
        unit='g'
      />
    </div>
  );
}