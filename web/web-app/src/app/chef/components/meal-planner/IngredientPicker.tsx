import * as React from 'react';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import classNames = require('classnames');
import {
  AdHocIngredient,
  parseAdHodIngredient,
  toAdHocIngredientStr,
} from '@mealz/backend-ingredients-shared';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { INGREDIENT_LANGUAGE, AD_HOC_UNIT } from '../../../common';
import { 
  ifEnterKey,
  Key,
  mapKey,
  parsePositiveInteger,
  setRefFocus,
  stopBubble,
} from '../../../utils';
import { Log } from '../../../log';
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
const DEFAULT_AMOUNT = '100';

export interface IngredientPickerProps {
  ingredient?: MealPlannerIngredient;
  onPickIngredient: (ingredient: GWIngredient, amount: string) => void;
  onPickAdHocIngredient: (ingredient: AdHocIngredient, amount: string) => void;
  onClose: () => void;
}

interface IngredientPickerState {
  // Identifier of the selected full ingredient
  ingredientId?: string;

  // Indicates if an ingredient has been selected by pressing enter,
  // selecting from the dropdown or passed in the properties
  ingredientSelected: boolean;

  // Entered ingredient name.
  name: string;

  // Entered amount.
  amount: string;

  // Element which currently has focus
  focus: Focus;

  // Dropdown properties
  dropdownVisible: boolean;
  dropdownIndex: number;
  dropdownIngredients: GWIngredient[];
}

export function IngredientPicker(props: IngredientPickerProps) {
  const ingredientStateFromProps = (): Pick<IngredientPickerState,
    'ingredientId' | 'ingredientSelected' | 'name' | 'amount'
  > => {
    const { ingredient } = props;
    const adHocIngredient = ingredient?.adHocIngredient;
    if (adHocIngredient) {
      return {
        ingredientId: undefined,
        ingredientSelected: true,
        name: toAdHocIngredientStr(adHocIngredient),
        amount: ingredient?.enteredAmount,
      };
    }
    const fullIngredient = ingredient?.fullIngredient;
    return {
      ingredientId: fullIngredient?.id,
      ingredientSelected: !!fullIngredient,
      amount: ingredient?.enteredAmount,
      name: fullIngredient?.name[INGREDIENT_LANGUAGE] ?? '',
    }
  };

  const [state, setState] = useState<IngredientPickerState>({
    ...ingredientStateFromProps(),
    focus: Focus.Name,
    dropdownVisible: false,
    dropdownIndex: 0,
    dropdownIngredients: [],
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
        dropdownIngredients: search(ingredientState.name),
      });
    },
    [props.ingredient],
  );

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Amount:
          setRefFocus(amount.ref, { select: true });
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

  // select an ingredient
  const selectIngredientByIndex = (index: number) => {
    const ingredient = state.dropdownIngredients[index];
    if (!ingredient) {
      Log.error('Ingredient not found when selecting by index');
      return;
    }

    patchState({
      ingredientSelected: true,
      amount: DEFAULT_AMOUNT,
      focus: Focus.Amount,
      dropdownVisible: false,
      ingredientId: ingredient.id,
      name: ingredient.name[INGREDIENT_LANGUAGE],
    });
  };
  const selectIngredientByEnter = () => {
    const isAdHoc = !!parseAdHodIngredient(state.name);
    if (isAdHoc) {
      patchState({
        ingredientSelected: true,
        amount: DEFAULT_AMOUNT,
        focus: Focus.Amount,
      });
      return;
    }
    selectIngredientByIndex(state.dropdownIndex);
  }

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
      if (!!ingredient.adHoc()) {
        // we don't have the real unit for ad-hoc ingredients
        return AD_HOC_UNIT;
      }
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

    visible: () => {
      // We don't show the amount when a user selected an ingredient.
      return (
        !!ingredient.has() &&
        state.focus !== Focus.Name
      );
    },

    isEmpty: () => {
      return !state.amount.length;
    },

    value: (): number | undefined => {
      const amount = state.amount
        ? parsePositiveInteger(state.amount)
        : undefined;
      return isNaN(amount) ? undefined : amount;
    },

    isValid: () : boolean => {
      // Empty amount is fine. It means that the amount will be calculated.
      if (!state.amount.length) {
        return true;
      }
      const value = amount.value();
      return value !== undefined && value > 0;
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
      if (!ingredient.has() || !amount.isValid()) {
        return;
      }
      if (ingredient.adHoc()) {
        props.onPickAdHocIngredient(ingredient.adHoc(), state.amount);
      }
      else {
        props.onPickIngredient(ingredient.full(), state.amount);
      }
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

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;

      const adHocIngredient = parseAdHodIngredient(name);
      if (adHocIngredient) {
        patchState({
          ingredientId: undefined,
          name,
          dropdownVisible: false,
          dropdownIngredients: [],
        });
        return;
      }

      const dropdownIngredients = search(name);
      const dropdownIndex = 0;
      patchState({
        ingredientId: dropdownIngredients[dropdownIndex]?.id,
        name,
        dropdownVisible: true,
        dropdownIndex,
        dropdownIngredients,
      });
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (mapKey(event)) {
        case Key.Enter:
          stopBubble(event);
          selectIngredientByEnter();
          return;
        case Key.ArrowDown:
          stopBubble(event);
          const length = state.dropdownIngredients.length;
          patchState({
            dropdownIndex: Math.min(state.dropdownIndex + 1, length - 1)
          });
          return;
        case Key.ArrowUp:
          stopBubble(event);
          patchState({
            dropdownIndex: Math.max(state.dropdownIndex - 1, 0),
          });
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
      if (state.focus === Focus.Name) {
        // Always show ad-hoc ingredients to let the user know
        // they properly entered an ad-hoc ingredient.
        const isAdHoc = !!ingredient.adHoc();
        if (isAdHoc) {
          const calories = ingredient.caloriesPer100();
          return (
            `${calories.toFixed(0)} kcal ` +
            `(${translate('ad-hoc-ingredient')})`
          );
        }
        return '';
      }

      if (!ingredient.has()) {
        return translate('unknown-ingredient');
      }
      if (amount.isEmpty()) {
        return translate('blank-amount-to-calculate');
      }
      if (!amount.isValid()) {
        return translate('invalid-amount');
      }

      const adHocLabel = !!ingredient.adHoc()
        ? ` ${translate('ad-hoc-ingredient')}`
        : '';
      const calories = ingredient.caloriesPer100();
      return calories ? `${calories.toFixed(0)} kcal${adHocLabel}` : '';
    },
  };

  // calories
  const calories = {
    visible: () => {
      return ingredient.has() && amount.value() !== undefined;
    },
    value: () => {
      const calculatedCalories = calculateFact(
        amount.value(),
        ingredient.caloriesPer100(),
      );
      return `${calculatedCalories.toFixed(0)}`;
    },
    unit: () => {
      return 'kcal';
    },
  };

  // dropdown
  const dropdown = {
    visible: () => {
      return (
        state.focus === Focus.Name &&
        state.name.length > 0 &&
        !ingredient.adHoc()
      );
    },
  };

  return (
    <>
      <div className='mealz-ingredient-picker'>
        { amount.visible() &&
          <>
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

            { calories.visible() &&
              <div className='mealz-ingredient-picker-amount-details'>
                <div className='mealz-ingredient-picker-amount-calories'>
                  { calories.value() }
                </div>
                <div className='mealz-ingredient-picker-amount-calories-unit'>
                  { calories.unit() }
                </div>
              </div>
            }
          </>
        }

        <div className='mealz-ingredient-picker-name'>
          <Form.Control
            type='text'
            placeholder={translate('type-to-pick-ingredient')}
            ref={name.ref}
            value={state.name}
            onFocus={name.onFocus}
            onChange={name.onChange}
            onKeyDown={name.onKeyDown}
          />
        </div>

        <div className='mealz-ingredient-picker-ingredient-details'>
          <div className={details.classNames()}>
            { details.label() }
          </div>
          { dropdown.visible() &&
            <IngredientsDropdown
              ingredients={state.dropdownIngredients}
              selectedIndex={state.dropdownIndex}
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