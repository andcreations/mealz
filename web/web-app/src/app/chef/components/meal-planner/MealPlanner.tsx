import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';

import { usePatchState, useService } from '../../../hooks';
import { useBusEventListener } from '../../../bus';
import { IngredientsCrudService } from '../../../ingredients';
import { MealPlannerIngredient } from '../../types';
import { IngredientsTopics } from '../../../ingredients';
import { ifEnterKey, ifValueDefined, focusRef, blurRef } from '../../../utils';
import { useTranslations } from '../../../i18n';
import { MealCalculator } from '../../services';
import { MealPlannerTranslations } from './MealPlanner.translations';
import { IngredientsEditor } from './IngredientsEditor';
import { MealSummary } from './MealSummary';

enum Focus { Calories };

interface MealPlannerState {
  ingredients: MealPlannerIngredient[];
  ingredientsRead: boolean;
  focus: Focus,
  calories: string;
  calculateAmountsStatus: string | null;
}

export function MealPlanner() {
  const [state, setState] = useState<MealPlannerState>({
    ingredients: [],
    ingredientsRead: false,
    focus: Focus.Calories,
    calories: '',
    calculateAmountsStatus: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPlannerTranslations);

  const ingredientsCrudService = useService(IngredientsCrudService);
  const mealCalculator = useService(MealCalculator);

  // initialize state
  useEffect(
    () => {
      // TODO Load ingredients from the cookies, local storage, backend...
      // const ingredients = ingredientsCrudService.getIngredients();
      patchState({
        ingredients: [
          // {
          //   fullIngredient: ingredients[0],
          //   enteredAmount: '100',
          //   calculatedAmount: 100,
          // },
          // {
          //   fullIngredient: ingredients[1],
          //   enteredAmount: '80',
          //   calculatedAmount: 80,
          // },
          // {
          //   fullIngredient: ingredients[2],
          //   enteredAmount: '75',
          //   calculatedAmount: 75,
          // },
        ],
      });
    },
    [state.ingredientsRead],
  );

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Calories:
          focusRef(calories.ref);
          break;
      }
    },
    [state.focus],
  );
  useEffect(
    () => focusRef(calories.ref),
    [],
  );  

  useBusEventListener(
    IngredientsTopics.IngredientsRead,
    () => patchState({ ingredientsRead: true }),
  );

  const recalculate = (
    caloriesStr: string,
    ingredients: MealPlannerIngredient[],
  ) => {
    const result = mealCalculator.calculateAmounts(
      calories.fromStr(caloriesStr),
      ingredients,
    );
    patchState({
      calories: caloriesStr,
      ingredients: result.ingredients,
      ...ifValueDefined<MealPlannerState>('calculateAmountsStatus', result.error),
    });
  };

  const onIngredientsChange = (ingredients: MealPlannerIngredient[]) => {
    recalculate(state.calories, ingredients);
  };

  const calories = {
    ref: useRef(null),

    fromStr: (caloriesStr: string): number | undefined => {
      if (!caloriesStr.length) {
        return;
      }
      const value = parseInt(caloriesStr);
      return !isNaN(value) ? value : undefined;
    },

    get: (): number | undefined => {
      return calories.fromStr(state.calories);
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      recalculate(event.target.value, state.ingredients);
    },

    onEnter: () => {
      blurRef(calories.ref);
    },
  };

  return (
    <div className='mealz-meal-planner'>
      <div className='mealz-meal-planner-calories'>
        <div>
          { translate('calories') }
        </div>
        <div className='mealz-meal-planner-calories-unit'>
          { `(${translate('kcal')})` }
        </div>
        <div className='mealz-meal-planner-calories-value'>
          <Form.Control
            type='number'
            placeholder=''
            ref={calories.ref}
            value={state.calories}
            onChange={calories.onChange}
            onKeyDown={ifEnterKey(calories.onEnter)}
          />
        </div>
      </div>
      <IngredientsEditor
        className='mealz-meal-planner-editor'
        ingredients={state.ingredients}
        onIngredientsChange={onIngredientsChange}
      />
      <MealSummary
        status={state.calculateAmountsStatus}
        calories={calories.get()}
        ingredients={state.ingredients}
      />
    </div>
  );
}