import * as React from 'react';

export interface MealDailyPlanEntrySummaryProps {
  calories: number;
  caloriesDetails: string;
  carbs: number;
  carbsDetails: string;
  protein: number;
  proteinDetails: string;
  fat: number;
  fatDetails: string;
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
          { props.caloriesDetails }
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
          { props.carbsDetails }
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
          { props.proteinDetails }
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
          { props.fatDetails }
        </div>
      </div>
    </div>
  );
}