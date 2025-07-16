import * as React from 'react';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import classNames = require('classnames');
import {
  AdHocIngredient,
  parseAdHodIngredient,
} from '@mealz/backend-ingredients-shared';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { INGREDIENT_LANGUAGE } from '../../../common';
import { 
  ifEnterKey,
  Key,
  mapKey,
  setRefFocus,
  stopBubble,
} from '../../../utils';
import { useTranslations } from '../../../i18n';
import { usePatchState, useService } from '../../../hooks';
import { MealPlannerIngredient } from '../../types';
import {
  getCaloriesPer100,
  calculateFact,
  IngredientsCrudService,
  IngredientsSearch,
} from '../../../ingredients';
import { IngredientsDropdown } from './IngredientsDropdown';
import { IngredientPickerTranslations } from './IngredientPicker.translations';

enum Focus { Amount, Name };

const SEARCH_LIMIT = 10;

export interface IngredientPickerProps {
  ingredient?: MealPlannerIngredient;
  onPickIngredient: (ingredientId: string, amount: string) => void;
  onClose: () => void;
}

interface IngredientPickerState {
  ingredientId?: string;
  amount?: string;
  name: string;
  focus: Focus;
  matchingIngredients: GWIngredient[];
  dropdownVisible: boolean;
  dropdownSelectedIndex: number;
}

export function IngredientPicker(props: IngredientPickerProps) {
  const ingredientStateFromProps = () => ({
    ingredientId: props.ingredient?.ingredient?.id,
    amount: props.ingredient?.enteredAmount,
    name: props.ingredient?.ingredient?.name[INGREDIENT_LANGUAGE] ?? '',
  })

  const [state, setState] = useState<IngredientPickerState>({
    focus: Focus.Name,
    matchingIngredients: [],
    dropdownVisible: false,
    dropdownSelectedIndex: 0,
    ...ingredientStateFromProps(),
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(IngredientPickerTranslations);

  const ingredientsCrudService = useService(IngredientsCrudService);
  const ingredientsSearch = useService(IngredientsSearch);

  // initialize state
  useEffect(
    () => {
      const ingredientState = ingredientStateFromProps();
      patchState({
        ...ingredientState,
        matchingIngredients: search(ingredientState.name),
      });
    },
    [props.ingredient],
  );

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Amount:
          setRefFocus(amount.ref);
          break;
        case Focus.Name:
          setRefFocus(name.ref);
          break;
      }
    },
    [state.focus],
  );
  useEffect(
    () => setRefFocus(name.ref, { select: true }),
    [],
  );

  // select an ingredient by index
  const selectIngredientByIndex = (index: number) => {
    const selectedIngredient = state.matchingIngredients[index];
    if (!selectedIngredient) {
      patchState({
        focus: Focus.Amount,
        dropdownVisible: false,
        ingredientId: undefined,
      });
      return;
    }

    setRefFocus(amount.ref);
    patchState({
      focus: Focus.Amount,
      dropdownVisible: false,
      ingredientId: selectedIngredient.id,
      name: selectedIngredient.name[INGREDIENT_LANGUAGE],
    });
  };

  // ingredient
  const ingredient = {
    full: () : GWIngredient | undefined => {
      return state.ingredientId
        ? ingredientsCrudService.getById(state.ingredientId)
        : undefined;
    },
    adHoc: (): AdHocIngredient | undefined => {
      return parseAdHodIngredient(state.name);
    },
    has: () : boolean => {
      return (
        ingredient.full() !== undefined ||
        ingredient.adHoc() !== undefined
      );
    },
    unitPer100: () : string => {
      // we don't have a unit for ad-hoc ingredients
      return ingredient.full()?.unitPer100 ?? '';
    },
    caloriesPer100: () : number | undefined => {
      const adHocIngredient = ingredient.adHoc();
      if (adHocIngredient) {
        return adHocIngredient.calories;
      }

      const fullIngredient = ingredient.full();
      if (fullIngredient) {
        return getCaloriesPer100(fullIngredient);
      }
    },
  };

  // search
  const search = (name: string): GWIngredient[] => {
    return ingredientsSearch.search(name, SEARCH_LIMIT);
  }

  // amount
  const amount = {
    ref: React.useRef(null),

    get: () : number | undefined => {
      const amount = state.amount ? parseFloat(state.amount) : undefined;
      return isNaN(amount) ? undefined : amount;
    },

    isValid: () : boolean => {
      return amount.get() !== undefined;
    },

    onFocus: () => {
      patchState({
        focus: Focus.Amount,
        dropdownVisible: false,
      });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      patchState({ amount: event.target.value });
    },

    onEnter: () => {
      if (!ingredient.has()) {
        return;
      }
      props.onPickIngredient(state.ingredientId, state.amount);
    },
  };

  // name
  const name = {
    ref: React.useRef(null),

    onFocus: () => {
      patchState({
        focus: Focus.Name,
        dropdownVisible: true,
      });
    },

    onBlur: () => {
      selectIngredientByIndex(state.dropdownSelectedIndex);
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      const isAdHoc = !!parseAdHodIngredient(name);
      patchState({
        name,
        matchingIngredients: search(name),
        dropdownSelectedIndex: !isAdHoc ? 0 : -1,
      });
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      const clamp = (index: number) => {
        if (index < 0) {
          return 0;
        }
        if (index >= state.matchingIngredients.length) {
          return state.matchingIngredients.length - 1;
        }
        return index;
      }

      switch (mapKey(event)) {
        case Key.Enter:
          stopBubble(event);
          selectIngredientByIndex(state.dropdownSelectedIndex);
          return;
        case Key.ArrowDown:
          stopBubble(event);
          patchState({
            dropdownSelectedIndex: clamp(state.dropdownSelectedIndex + 1) },
          );
          return;
        case Key.ArrowUp:
          stopBubble(event);
          patchState({
            dropdownSelectedIndex: clamp(state.dropdownSelectedIndex - 1) },
          );
          return;
      }
    }
  };

  // details
  const details = {
    classNames: () => classNames(
      'mealz-ingredient-picker-ingredient-details-label',
      { 'mealz-error': !ingredient.has() || !amount.isValid() },
    ),
    label: (): string => {
      if (!ingredient.has()) {
        return translate('unknown-ingredient');
      }
      if (!amount.isValid()) {
        return translate('invalid-amount');
      }
      const adHoc = !!ingredient.adHoc()
        ? ` (${translate('ad-hoc-ingredient')})`
        : '';
      const calories = ingredient.caloriesPer100();
      return calories ? `${calories} kcal${adHoc}` : '-';
    },
  };

  // calories
  const calories = {
    value: () => {
      if (!ingredient.has() || !amount.isValid()) {
        return '';
      }
      const calculatedCalories = calculateFact(
        amount.get(),
        ingredient.caloriesPer100(),
      );
      return `${calculatedCalories.toFixed(0)}`;
    },
    unit: () => {
      if (!ingredient.has() || !amount.isValid()) {
        return '';
      }
      return 'kcal';
    },
  };

  return (
    <>
      <div className='mealz-ingredient-picker'>
        <div className='mealz-ingredient-picker-amount'>
          <div className='mealz-ingredient-picker-amount-value'>
            <Form.Control
              type='number'
              placeholder='…'
              ref={amount.ref}
              value={state.amount ?? ''}
              onFocus={amount.onFocus}
              onChange={amount.onChange}
              onKeyDown={ifEnterKey(amount.onEnter)}
            />
          </div>
          <div className='mealz-ingredient-picker-amount-unit'>
            { ingredient.unitPer100() }
          </div>
        </div>

        <div className='mealz-ingredient-picker-amount-details'>
          <div className='mealz-ingredient-picker-amount-calories'>
            { calories.value() }
          </div>
          <div className='mealz-ingredient-picker-amount-calories-unit'>
            { calories.unit() }
          </div>
        </div>

        <div className='mealz-ingredient-picker-name'>
          <Form.Control
            type='text'
            placeholder={translate('type-to-pick-ingredient')}
            ref={name.ref}
            value={state.name}
            onFocus={name.onFocus}
            onBlur={name.onBlur}
            onChange={name.onChange}
            onKeyDown={name.onKeyDown}
          />
        </div>

        <div className='mealz-ingredient-picker-ingredient-details'>
          <div className={details.classNames()}>
            { details.label() }
          </div>
          { state.dropdownVisible &&
            <IngredientsDropdown
              ingredients={state.matchingIngredients}
              selectedIndex={state.dropdownSelectedIndex}
              onSelect={selectIngredientByIndex}
            />
          }
        </div>
      </div>
      <div
        className='mealz-ingredient-picker-overlay'
        onClick={props.onClose}
      />
    </>
  );
}