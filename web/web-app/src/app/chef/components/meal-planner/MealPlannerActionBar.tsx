import * as React from 'react';
import { MaterialIcon } from '../../../components';

export interface MealPlannerActionBarProps {
  onLogMeal: () => void;
}

export function MealPlannerActionBar(props: MealPlannerActionBarProps) {
  const onLogMeal = () => {
    props.onLogMeal();
  }

  return (
    <div className='mealz-meal-planner-action-bar'>
      <MaterialIcon
        icon='note_add'
        onClick={onLogMeal}
      />
    </div>
  );
}