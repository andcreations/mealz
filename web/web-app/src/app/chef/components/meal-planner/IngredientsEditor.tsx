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
import { Macros, MealPlannerIngredient } from '../../types';
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
    const hasIngredient = hasFullIngredient || hasAdHocIngredient;
    const hasEnteredAmount = !!ingredient.enteredAmount;

    const fromCalculatedAmount = () => {
      return ingredient.calculatedAmount !== INVALID_AMOUNT
        ? ingredient.calculatedAmount.toFixed(0)
        : '?';
    };

    let amount = '';
    if (hasIngredient && !hasEnteredAmount) {
      amount += '*';
    }
    amount += hasIngredient ? fromCalculatedAmount() : '';
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

    // name
    let name = translate('pick-ingredient');
    if (!!ingredient.adHocIngredient) {
      name = ingredient.adHocIngredient.name;
    }
    if (!!ingredient.fullIngredient) {
      name = ingredient.fullIngredient.name[INGREDIENT_LANGUAGE];
    }

    // details
    let calories = undefined;
    let macros: Partial<Macros> | undefined;

    // calories as details
    if (
      hasIngredient &&
      userSettings.showCaloriesInIngredientsEditor() &&
      ingredient.calculatedAmount !== INVALID_AMOUNT
    ) {
      calories = mealCalculator.getCaloriesForAmount(
        ingredient,
        ingredient.calculatedAmount,
      );
      macros = mealCalculator.getMacrosForAmount(
        ingredient,
        ingredient.calculatedAmount,
      );
    }

    const hasCalories = calories > 0;
    const hasMacros = (
      macros && (macros.carbs > 0 || macros.protein > 0 || macros.fat > 0)
    );

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
        <div>
          {name}
        </div>
        { (hasCalories || hasMacros) &&
          <div className='mealz-ingredients-editor-name-details'>
            { calories > 0 &&
              <span className='mealz-ingredients-editor-name-details-calories'>
                { calories.toFixed(0) } kcal
              </span>
            }
            { macros?.carbs > 0 &&
              <>
                <span
                  className='mealz-ingredients-editor-name-details-separator'
                >
                  ·
                </span>
                <span className='mealz-ingredients-editor-name-details-carbs'>
                  { macros.carbs.toFixed(0) } g
                </span>
              </>
            }
            { macros?.protein > 0 &&
              <>
                <span
                  className='mealz-ingredients-editor-name-details-separator'
                >
                  ·
                </span>
                <span className='mealz-ingredients-editor-name-details-protein'>
                  { macros.protein.toFixed(0) } g
                </span>
              </>
            }
            { macros?.fat > 0 &&
              <>
                <span
                  className='mealz-ingredients-editor-name-details-separator'
                >
                  ·
                </span>
                <span className='mealz-ingredients-editor-name-details-fat'>
                  { macros.fat.toFixed(0) } g
                </span>
              </>
            }
          </div>
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

  const resolveGridRows = () => {
    if (state.ingredients.length === 0) {
      return '1.5rem';
    }
    let rows = '';
    state.ingredients.forEach((ingredient, index) => {
      const hasIngredient = (
        !!ingredient.fullIngredient || 
        !!ingredient.adHocIngredient
      );
      if (hasIngredient) {
        rows += '2.625rem ';
      } else {
        rows += '1.5rem ';
      }
    });
    return rows;
  };

  const entriesStyles = {
    gridTemplateRows: resolveGridRows(),
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