import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { AdHocIngredient } from '@mealz/backend-ingredients-shared';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { patchAtIndex, removeFromIndex } from '../../../utils';
import { AD_HOC_UNIT, INGREDIENT_LANGUAGE } from '../../../common';
import { useTranslations } from '../../../i18n';
import { usePatchState } from '../../../hooks';
import { MealPlannerIngredient } from '../../types';
import {
  IngredientsEditorTranslations,
} from './IngredientsEditor.translations';
import { IngredientPickerWrapper } from './IngredientPickerWrapper';
import { MaterialIcon } from '../../../components';

export interface IngredientsEditorProps {
  ingredients: MealPlannerIngredient[];
  onIngredientsChange: (ingredients: MealPlannerIngredient[]) => void;
}

interface IngredientsEditorState {
  ingredients: MealPlannerIngredient[];
  pickIngredientIndex: number | null;
}

export function IngredientsEditor(props: IngredientsEditorProps) {
  const [state, setState] = useState<IngredientsEditorState>({
    ingredients: props.ingredients,
    pickIngredientIndex: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(IngredientsEditorTranslations);

  useEffect(
    () => {
      patchState({
        ingredients: props.ingredients,
        pickIngredientIndex: null,
      });
    },
    [props.ingredients],
  );

  const onOpenIngredientPicker = (index: number) => {
    patchState({ pickIngredientIndex: index });
  };
  const onCloseIngredientPicker = () => {
    patchState({ pickIngredientIndex: null });
  };

  const onAddIngredient = () => {
    patchState({
      ingredients: [
        ...state.ingredients,
        {},
      ],
      pickIngredientIndex: state.ingredients.length,
    })
  };

  const onDeleteIngredient = () => {
    patchState({
      ingredients: removeFromIndex(
        state.ingredients,
        state.pickIngredientIndex,
      ),
      pickIngredientIndex: null,
    });
  };

  const onIngredientChange = (update: Partial<MealPlannerIngredient>): void => {
    const ingredients = patchAtIndex(
      state.ingredients,
      state.pickIngredientIndex,
      update,
    );
    props.onIngredientsChange(ingredients);
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
    onIngredientChange(update);
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
    onIngredientChange(update);
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
        className='mealz-ingredients-editor-amount'
        onClick={() => onOpenIngredientPicker(ingredientIndex)}
      >
        <div className='mealz-ingredients-editor-amount-value'>
          {amount}
        </div>
        <div className='mealz-ingredients-editor-amount-unit'>
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
      'mealz-ingredients-editor-name',
      { 'mealz-ingredients-editor-not-picked': !hasIngredient },
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
      <div className='mealz-ingredients-editor'>
        <div className='mealz-ingredients-editor-entries' style={styles}>
          {renderEntries()}
        </div>
        <div className='mealz-ingredients-editor-plus'>
          <MaterialIcon
            icon='add_circle'
            onClick={onAddIngredient}
          />
        </div>
      </div>
      <IngredientPickerWrapper
        visible={state.pickIngredientIndex !== null}
        ingredient={state.ingredients[state.pickIngredientIndex]}
        onPickIngredient={onPickIngredient}
        onPickAdHocIngredient={onPickAdHocIngredient}
        onDeleteIngredient={onDeleteIngredient}
        onCancel={onCloseIngredientPicker}
      />
    </>
  );
}