import * as React from 'react';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

export interface MealNameMenuItemProps {
  name: string;
  goals?: GWMealDailyPlanGoals;
}

export function MealNameMenuItem(props: MealNameMenuItemProps) {
  const { goals } = props;
  const goal = (from: number, to: number) => {
    const avg = (from + to) / 2;
    return avg.toFixed(0);
  };
  
  return (
    <div className='mealz-meal-planner-menu-item'>
      <div className='mealz-meal-planner-menu-item-name'>
        {props.name}
      </div>
      { !!goals &&
        <div className='mealz-meal-planner-menu-item-goals'>
          <div className='mealz-meal-planner-menu-item-goals-goals'>
            Goals:
          </div>
          <div className='mealz-meal-planner-menu-item-goals-calories'>
            {goal(goals.caloriesFrom, goals.caloriesTo)} kcal
          </div>
          <div className='mealz-meal-planner-menu-item-goals-separator'>
            ·
          </div>
          <div className='mealz-meal-planner-menu-item-goals-carbs'>
            {goal(goals.carbsFrom, goals.carbsTo)} g
          </div>
          <div className='mealz-meal-planner-menu-item-goals-separator'>
            ·
          </div>
          <div className='mealz-meal-planner-menu-item-goals-protein'>
            {goal(goals.proteinFrom, goals.proteinTo)} g
          </div>
          <div className='mealz-meal-planner-menu-item-goals-separator'>
            ·
          </div>
          <div className='mealz-meal-planner-menu-item-goals-fat'>
            {goal(goals.fatFrom, goals.fatTo)} g
          </div>
        </div>
      }
    </div>
  );
}