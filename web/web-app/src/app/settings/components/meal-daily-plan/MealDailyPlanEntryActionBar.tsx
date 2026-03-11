import * as React from 'react';
import { MaterialIcon } from '../../../components';

export interface MealDailyPlanEntryActionBarProps {
  autoCalculateMacrosEnabled: boolean;
  onEdit: () => void;
  onAutoCalculate: () => void;
  onDelete: () => void;
}

export function MealDailyPlanEntryActionBar(
  props: MealDailyPlanEntryActionBarProps,
) {
  return (
    <div className='mealz-meal-daily-plan-entry-action-bar'>
      <MaterialIcon
        icon='edit'
        onClick={props.onEdit}
      />
      <MaterialIcon
        icon='bolt'
        disabled={!props.autoCalculateMacrosEnabled}
        onClick={props.onAutoCalculate}
      />
      <MaterialIcon
        icon='delete'
        onClick={props.onDelete}
      />
    </div>
  );
}