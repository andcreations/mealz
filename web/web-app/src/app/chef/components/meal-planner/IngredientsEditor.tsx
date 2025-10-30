import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { AdHocIngredient } from '@mealz/backend-ingredients-shared';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { patchAtIndex, removeFromIndex } from '../../../utils';
import { AD_HOC_UNIT, INGREDIENT_LANGUAGE } from '../../../common';
import { useTranslations } from '../../../i18n';
import { usePatchState, useService } from '../../../hooks';
import { UserSettingsService } from '../../../user';
import { MealPlannerIngredient } from '../../types';
import {
  IngredientsEditorTranslations,
} from './IngredientsEditor.translations';
import { IngredientPickerWrapper } from './IngredientPickerWrapper';
import { MaterialIcon } from '../../../components';
import { INVALID_AMOUNT } from '../../const';
import { MealCalculator } from '../../services';

export interface IngredientsEditorProps {
  className?: string;
  ingredients: MealPlannerIngredient[];
  onIngredientsChange: (ingredients: MealPlannerIngredient[]) => void;
}

interface IngredientsEditorState {
  ingredients: MealPlannerIngredient[];
  pickIngredientIndex: number | null;
}

export function IngredientsEditor(props: IngredientsEditorProps) {
  const userSettings = useService(UserSettingsService);
  const mealCalculator = useService(MealCalculator);

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
    const ingredients = removeFromIndex(
      state.ingredients,
      state.pickIngredientIndex,
    );
    props.onIngredientsChange(ingredients);
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

    const fromCalculatedAmount = () => {
      return ingredient.calculatedAmount !== INVALID_AMOUNT
        ? ingredient.calculatedAmount.toFixed(0)
        : '?';
    };

    const amount = (hasFullIngredient || hasAdHocIngredient)
      ? fromCalculatedAmount()
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

  const renderNameWithDetails = (
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

    const caloriesPer100 = mealCalculator.getCaloriesPer100(ingredient);
    const showCalories = userSettings.showCaloriesInIngredientsEditor();
    const details = caloriesPer100 && showCalories
      ? `(${caloriesPer100.toFixed(0)} kcal)`
      : undefined;

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
        <span>
          {name}
        </span>
        { details &&
          <span className='mealz-ingredients-editor-name-details'>
            {details}
          </span>
        }
      </div>
    );
  };

  const renderIngredients = () => {
    const entries = [];
    state.ingredients.forEach((ingredient, index) => {
      const id = `ingredient-${index}`;
      entries.push(
        renderAmount(`${id}-amount`, index, ingredient),
        renderNameWithDetails(`${id}-name`, index, ingredient),
      );
    });
    return entries;
  };

  const rowCount = state.ingredients.length || 1;
  const entriesStyles = {
    gridTemplateRows: `repeat(${rowCount}, 1.5rem)`,
  };
  const editorClassNames = classNames(
    'mealz-ingredients-editor',
    props.className,
  );

  return (
    <>
      <div className={editorClassNames}>
        <div
          className='mealz-ingredients-editor-ingredients'
          style={entriesStyles}
        >
          { state.ingredients.length > 0 && renderIngredients() }
          { state.ingredients.length === 0 &&
            <div
              className='mealz-ingredients-editor-no-ingredients'
              onClick={onAddIngredient}
            >
              {translate('no-ingredients')}
            </div>
          }
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