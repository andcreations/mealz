import * as React from 'react';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

import { INGREDIENT_LANGUAGE } from '../../../common';
import { usePatchState, useService } from '../../../hooks';
import { IngredientsCrudService } from '../../../ingredients';
import { MealPlannerIngredient } from '../../types';

export interface IngredientPickerProps {
  ingredient?: MealPlannerIngredient;
  onClose: () => void;
}

interface IngredientPickerState {
  ingredientId?: string;
  amount?: string;
  changeAmount: boolean;
  name: string;
}

export function IngredientPicker(props: IngredientPickerProps) {
  const ingredientStateFromProps = () => ({
    ingredientId: props.ingredient?.ingredient?.id,
    amount: props.ingredient?.enteredAmount,
    name: props.ingredient?.ingredient?.name[INGREDIENT_LANGUAGE] ?? '',
  })

  const [state, setState] = useState<IngredientPickerState>({
    changeAmount: false,
    ...ingredientStateFromProps(),
  });
  const patchState = usePatchState(setState);
  const ingredientsCrudService = useService(IngredientsCrudService);

  useEffect(
    () => patchState(ingredientStateFromProps()),
    [props.ingredient],
  );

  const onAmountClicked = () => {
    patchState({ changeAmount: true });
  };
  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    patchState({ amount: event.target.value });
  };
  const onAmountBlur = () => {
    patchState({ changeAmount: false });
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    patchState({ name: event.target.value });
  };

  const ingredient = state.ingredientId
    ? ingredientsCrudService.getById(state.ingredientId)
    : undefined;
  return (
    <>
      <div className='mealz-ingredient-picker'>
        <div className='mealz-ingredient-picker-amount'>
          <div
            className='mealz-ingredient-picker-amount-value'
            onClick={onAmountClicked}
          >
            { !state.changeAmount &&
              (state.amount ?? '…')
            }
            { state.changeAmount &&
              <Form.Control
                type='text'
                placeholder='…'
                value={state.amount ?? ''}
                onChange={onAmountChange}
                onBlur={onAmountBlur}
              />
            }
          </div>
          <div 
            className='mealz-ingredient-picker-amount-unit'
            onClick={onAmountClicked}
          >
            { ingredient?.unitPer100 ?? '?' }
          </div>
        </div>
        <div className='mealz-ingredient-picker-name'>
          <Form.Control
            type='text'
            placeholder='Type to pick ingredient...'
            value={state.name}
            onChange={onNameChange}
            autoFocus
          />
        </div>
      </div>
      <div
        className='mealz-ingredient-picker-overlay'
        onClick={props.onClose}
      />
    </>
  );
}