import * as React from 'react';
import { GWMacrosSummary } from '@mealz/backend-meals-log-gateway-api';

import { MacrosSummaryBox, MacrosSummaryBoxType } from './MacrosSummaryBox';

export interface MacrosSummaryProps {
  macrosSummary: GWMacrosSummary;
}

export function MacrosSummary(props: MacrosSummaryProps) {
  return (
    <div className='mealz-macros-summary'>
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Calories}
        amount={props.macrosSummary.calories}
        unit='kcal'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Carbs}
        amount={props.macrosSummary.carbs}
        unit='g'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Protein}
        amount={props.macrosSummary.protein}
        unit='g'
      />
      <MacrosSummaryBox
        type={MacrosSummaryBoxType.Fat}
        amount={props.macrosSummary.fat}
        unit='g'
      />
    </div>
  );
}