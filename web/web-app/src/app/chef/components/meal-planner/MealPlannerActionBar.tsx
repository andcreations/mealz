import * as React from 'react';
import { MaterialIcon } from '../../../components';

export interface MealPlannerActionBarProps {
  onLogMeal: () => void;
  onClearMeal: () => void;
}

export function MealPlannerActionBar(props: MealPlannerActionBarProps) {
  const Separator = () => {
    return (
      <div className='mealz-meal-planner-action-bar-separator'>
        &middot;
      </div>
    );
  }

  return (
    <div className='mealz-meal-planner-action-bar'>
      <MaterialIcon
        className='mealz-meal-planner-action-bar-icon'
        icon='delete'
        onClick={props.onClearMeal}
      />
      <Separator/>
      <MaterialIcon
        className='mealz-meal-planner-action-bar-icon'
        icon='note_add'
        onClick={props.onLogMeal}
      />
    </div>
  );
}