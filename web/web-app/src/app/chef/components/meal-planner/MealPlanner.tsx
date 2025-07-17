import * as React from 'react';
import { useState, useEffect } from 'react';

import { useBusEventListener, usePatchState, useService } from '../../../hooks';
import { IngredientsCrudService } from '../../../ingredients';
import { MealPlannerIngredient } from '../../types';
import { IngredientsEditor } from './IngredientsEditor';
import { IngredientsTopics } from '../../../ingredients/bus';
import { calculateAmounts } from '../../calculator';

interface MealPlannerState {
  ingredients: MealPlannerIngredient[];
  ingredientsRead: boolean;
}

export function MealPlanner() {
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
        ],
      });
    },
    [state.ingredientsRead],
  );

  useBusEventListener(
    IngredientsTopics.IngredientsRead,
    () => patchState({ ingredientsRead: true }),
  );

  const onIngredientsChange = (ingredients: MealPlannerIngredient[]) => {
    console.log('onIngredientsChange', ingredients);
    patchState({
      ingredients: calculateAmounts(ingredients),
    });
  };

  return (
    <div className='mealz-meal-planner'>
      <IngredientsEditor
        ingredients={state.ingredients}
        onIngredientsChange={onIngredientsChange}
      />
    </div>
  );
}