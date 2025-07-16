import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { patchAtIndex } from '../../../utils';
import { INGREDIENT_LANGUAGE } from '../../../common';
import { useTranslations } from '../../../i18n';
import { usePatchState, useService } from '../../../hooks';
import { IngredientsCrudService } from '../../../ingredients';
import { MealPlannerIngredient } from '../../types';
import { MealPlannerTranslations } from './MealPlanner.translations';
import { IngredientPickerWrapper } from './IngredientPickerWrapper';

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
  const ingredientsCrudService = useService(IngredientsCrudService);


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

  const onPickIngredient = (ingredientId: string, amount: string) => {
    const update: Partial<MealPlannerIngredient> = {
      ingredient: ingredientsCrudService.getById(ingredientId),
      enteredAmount: amount,
    };
    // TODO Calculate the ingredients.
    patchState({
      ingredients: patchAtIndex(
        state.ingredients,
        state.pickIngredientIndex,
        update,
      ),
      pickIngredientIndex: null,
    });
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
        onClose={onCloseIngredientPicker}
      />
    </>
  );
}