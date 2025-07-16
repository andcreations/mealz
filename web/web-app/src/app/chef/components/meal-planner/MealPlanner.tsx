import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { AdHocIngredient } from '@mealz/backend-ingredients-shared';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { patchAtIndex } from '../../../utils';
import { AD_HOC_UNIT, INGREDIENT_LANGUAGE } from '../../../common';
import { useTranslations } from '../../../i18n';
import { usePatchState } from '../../../hooks';
import { MealPlannerIngredient } from '../../types';
import { MealPlannerTranslations } from './MealPlanner.translations';
import { IngredientPickerWrapper } from './IngredientPickerWrapper';
import { calculateAmounts } from '../../calculator';

export interface MealPlannerProps {
  ingredients: MealPlannerIngredient[];
}

interface MealPlannerState {
  ingredients: MealPlannerIngredient[];
  pickIngredientIndex: number | null;
}

export function MealPlanner(props: MealPlannerProps) {
  const [state, setState] = useState<MealPlannerState>({
    ingredients: props.ingredients,
    pickIngredientIndex: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPlannerTranslations);

  useEffect(
    () => {
      patchState({ ingredients: props.ingredients });
    },
    [props.ingredients],
  );

  const onOpenIngredientPicker = (index: number) => {
    patchState({ pickIngredientIndex: index });
  };
  const onCloseIngredientPicker = () => {
    patchState({ pickIngredientIndex: null });
  };

  const updateIngredient = (update: Partial<MealPlannerIngredient>): void => {
    const ingredients = patchAtIndex(
      state.ingredients,
      state.pickIngredientIndex,
      update,
    );
    patchState({
      ingredients: calculateAmounts(ingredients),
      pickIngredientIndex: null,
    });    
  }

  const onPickIngredient = (
    ingredient: GWIngredient,
    amount: string,
  ): void => {
    const update: Partial<MealPlannerIngredient> = {
      fullIngredient: ingredient,
      adHocIngredient: undefined,
      enteredAmount: amount,
    };
    updateIngredient(update);
  };

  const onPickAdHocIngredient = (
    adHocIngredient: AdHocIngredient,
    amount: string,
  ): void => {
    const update: Partial<MealPlannerIngredient> = {
      fullIngredient: undefined,
      adHocIngredient,
      enteredAmount: amount,
    };
    updateIngredient(update);
  };

  const renderAmount = (
    key: string,
    ingredientIndex: number,
    ingredient: MealPlannerIngredient,
  ) => {
    const hasFullIngredient = !!ingredient.fullIngredient;
    const hasAdHocIngredient = !!ingredient.adHocIngredient;

    const amount = (hasFullIngredient || hasAdHocIngredient)
      ? ingredient.calculatedAmount
      : '';
    let unit = '';
    if (hasFullIngredient) {
      unit = ingredient.fullIngredient.unitPer100;
    }
    if (hasAdHocIngredient) {
      unit = AD_HOC_UNIT;
    }

    return (
      <div
        key={key}
        className='mealz-meal-planner-amount'
        onClick={() => onOpenIngredientPicker(ingredientIndex)}
      >
        <div className='mealz-meal-planner-amount-value'>
          {amount}
        </div>
        <div className='mealz-meal-planner-amount-unit'>
          {unit}
        </div>
      </div>
    );
  };
  const renderName = (
    key: string,
    ingredientIndex: number,
    ingredient: MealPlannerIngredient,
  ) => {
    const hasIngredient = (
      !!ingredient.fullIngredient || 
      !!ingredient.adHocIngredient
    );

    let name = translate('pick-ingredient');
    if (!!ingredient.adHocIngredient) {
      name = ingredient.adHocIngredient.name;
    }
    if (!!ingredient.fullIngredient) {
      name = ingredient.fullIngredient.name[INGREDIENT_LANGUAGE];
    }

    const nameClassNames = classNames(
      'mealz-meal-planner-name',
      { 'mealz-meal-planner-not-picked': !hasIngredient },
    );
    return (
      <div
        key={key}
        className={nameClassNames}
        onClick={() => onOpenIngredientPicker(ingredientIndex)}
      >
        {name}
      </div>
    );
  };

  const renderEntries = () => {
    const entries = [];
    state.ingredients.forEach((ingredient, index) => {
      const id = `ingredient-${index}`;
      entries.push(
        renderAmount(`${id}-amount`, index, ingredient),
        renderName(`${id}-name`, index, ingredient),
      );
    });
    return entries;
  };

  const styles = {
    gridTemplateRows: `repeat(${state.ingredients.length}, 1.5rem)`,
  };

  return (
    <>
      <div className='mealz-meal-planner' style={styles}>
        {renderEntries()}
      </div>
      <IngredientPickerWrapper
        visible={state.pickIngredientIndex !== null}
        ingredient={state.ingredients[state.pickIngredientIndex]}
        onPickIngredient={onPickIngredient}
        onPickAdHocIngredient={onPickAdHocIngredient}
        onClose={onCloseIngredientPicker}
      />
    </>
  );
}