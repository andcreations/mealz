import * as React from 'react';
import { useState, useEffect } from 'react';

import { useBusEventListener, usePatchState, useService } from '../../../hooks';
import { IngredientsCrudService } from '../../../ingredients';
import { MealPlannerIngredient } from '../../types';
import { MealPlanner } from './MealPlanner';
import { IngredientsTopics } from '../../../ingredients/bus';

interface MealPlannerState {
  ingredients: MealPlannerIngredient[];
  ingredientsRead: boolean;
}

export function MealPlannerWrapper() {
  const ingredientsCrudService = useService(IngredientsCrudService);

  const [state, setState] = useState<MealPlannerState>({
    ingredients: [],
    ingredientsRead: false,
  });
  const patchState = usePatchState(setState);

  useEffect(
    () => {
      // TODO Load ingredients from the cookies, local storage...
      const ingredients = ingredientsCrudService.getIngredients();
      patchState({
        ingredients: [
          {
            fullIngredient: ingredients[0],
            enteredAmount: '100',
            calculatedAmount: 100,
          },
          {
            fullIngredient: ingredients[1],
            enteredAmount: '80',
            calculatedAmount: 80,
          },
          {
            fullIngredient: ingredients[2],
            enteredAmount: '75',
            calculatedAmount: 75,
          },
          {
            enteredAmount: '20',
          }
        ],
      });
    },
    [state.ingredientsRead],
  );

  useBusEventListener(
    IngredientsTopics.IngredientsRead,
    () => patchState({ ingredientsRead: true }),
  );

  return (
    <div className='mealz-meal-planner-wrapper'>
      <MealPlanner ingredients={state.ingredients}/>
    </div>
  );
}