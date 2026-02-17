import * as React from 'react';
import { MaterialIcon } from '../../../components';

export interface MealDailyPlanEntryActionBarProps {
  onEdit: () => void;
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
        icon='delete'
        onClick={props.onDelete}
      />
    </div>
  );
}