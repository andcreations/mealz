import * as React from 'react';

export interface MealDailyPlanEntrySummaryProps {
  calories: number;
  caloriesPercent: string;
  carbs: number;
  carbsPercent: string;
  protein: number;
  proteinPercent: string;
  fat: number;
  fatPercent: string;
  onClick: () => void;
}

export function MealDailyPlanEntrySummary(
  props: MealDailyPlanEntrySummaryProps,
) {
  return (
    <div
      className='mealz-meal-daily-plan-entry-summary'
      onClick={() => props.onClick()}
    >
      <div
        className='
          mealz-meal-daily-plan-entry-summary-amount
          mealz-meal-daily-plan-entry-summary-calories'
      >
        <div>{ props.calories } kcal</div>
        <div className='mealz-meal-daily-plan-entry-summary-percentage'>
          { props.caloriesPercent }%
        </div>
      </div>
      <div className='mealz-meal-daily-plan-entry-summary-separator'>·</div>
      <div
        className='
          mealz-meal-daily-plan-entry-summary-amount
          mealz-meal-daily-plan-entry-summary-carbs'
      >
        <div>{ props.carbs } g</div>
        <div className='mealz-meal-daily-plan-entry-summary-percentage'>
          { props.carbsPercent }%
        </div>
      </div>
      <div className='mealz-meal-daily-plan-entry-summary-separator'>·</div>
      <div
        className='
          mealz-meal-daily-plan-entry-summary-amount
          mealz-meal-daily-plan-entry-summary-protein'
      >
        <div>{ props.protein } g</div>
        <div className='mealz-meal-daily-plan-entry-summary-percentage'>
          { props.proteinPercent }%
        </div>
      </div>
      <div className='mealz-meal-daily-plan-entry-summary-separator'>·</div>
      <div
        className='
          mealz-meal-daily-plan-entry-summary-amount
          mealz-meal-daily-plan-entry-summary-fat'
      >
        <div>{ props.fat } g</div>
        <div className='mealz-meal-daily-plan-entry-summary-percentage'>
          { props.fatPercent }%
        </div>
      </div>
    </div>
  );
}