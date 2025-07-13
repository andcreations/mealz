import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { INGREDIENT_LANGUAGE } from '../../../common';
import { useTranslations } from '../../../i18n';
import { usePatchState } from '../../../hooks';
import { MealPlannerIngredient } from '../../types';
import { MealPlannerTranslations } from './MealPlanner.translations';
import { IngredientPickerWrapper } from './IngredientPickerWrapper';

export interface MealPlannerProps {
  ingredients: MealPlannerIngredient[];
}

interface MealPlannerState {
  ingredients: MealPlannerIngredient[];
  pickIngredient: MealPlannerIngredient | null;
}

export function MealPlanner(props: MealPlannerProps) {
  const [state, setState] = useState<MealPlannerState>({
    ingredients: props.ingredients,
    pickIngredient: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPlannerTranslations);

  useEffect(
    () => {
      patchState({ ingredients: props.ingredients });
    },
    [props.ingredients],
  );

  const onPickIngredient = (index: number) => {
    const pickIngredient = state.ingredients[index];
    patchState({ pickIngredient });
  };

  const onCloseIngredientPicker = () => {
    patchState({ pickIngredient: null });
  };

  const renderAmount = (
    key: string,
    ingredientIndex: number,
    ingredient: MealPlannerIngredient,
  ) => {
    const amount = ingredient.calculatedAmount ?? '';
    const unit = ingredient.ingredient?.unitPer100 ?? '';

    return (
      <div
        key={key}
        className='mealz-meal-planner-amount'
        onClick={() => onPickIngredient(ingredientIndex)}
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
    const hasIngredient = !!ingredient.ingredient;
    const name = hasIngredient
      ? ingredient.ingredient.name[INGREDIENT_LANGUAGE]
      : translate('pick-ingredient');
    const nameClassNames = classNames(
      'mealz-meal-planner-name',
      { 'mealz-meal-planner-not-picked': !hasIngredient },
    );
    return (
      <div
        key={key}
        className={nameClassNames}
        onClick={() => onPickIngredient(ingredientIndex)}
      >
        {name}
      </div>
    );
  };

  const renderEntries = () => {
    const entries = [];
    state.ingredients.forEach((ingredient, index) => {
      const id = ingredient.ingredient?.id ?? `ingredient-${index}`;
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
        visible={state.pickIngredient !== null}
        ingredient={state.pickIngredient}
        onClose={onCloseIngredientPicker}
      />
    </>
  );
}