import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import classNames = require('classnames');

import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { focusRef, Key, mapKey, stopBubble } from '../../../utils';
import { LinkButton } from '../../../components';
import { MealCalculator, MealPortionService } from '../../services';
import { MealPlannerIngredient, MealSummaryResult } from '../../types';
import { MealPortionTranslations } from './MealPortion.translations';

enum Focus { Portion };

export interface MealPortionProps {
  ingredients: MealPlannerIngredient[];
  show: boolean;
  onClose: () => void;
  onPortion: (ingredients: MealPlannerIngredient[]) => void;
}

interface MealPortionState {
  focus: Focus;
  summary: MealSummaryResult;
  portion: string;
  portionError?: string;
}

export function MealPortion(props: MealPortionProps) {
  const mealCalculator = useService(MealCalculator);
  const mealPortionService = useService(MealPortionService);

  const [state, setState] = useState<MealPortionState>({
    focus: Focus.Portion,
    summary: mealCalculator.summarize(props.ingredients),
    portion: '',
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPortionTranslations);

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Portion:
          focusRef(portion.ref, { select: true });
          break;
      }
    },
    [state.focus],
  );

  const portion = {
    ref: useRef(null),

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const portionStr = event.target.value;
      const isValid = mealPortionService.isValid(
        portionStr,
        state.summary.total.grams,
      );
      if (!isValid) {
        patchState({ 
          portion: portionStr,
          portionError: translate('invalid-portion'),
        });
        return;
      }
      patchState({
        portion: portionStr,
        portionError: undefined,
      });
    },

    onPortion: () => {
      const portion = mealPortionService.parse(
        state.portion,
        state.summary.total.grams,
      );
      const ingredients = mealPortionService.portionIngredients(
        props.ingredients,
        portion,
      );
      props.onPortion(ingredients);
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (mapKey(event)) {
        case Key.Enter:
          stopBubble(event);
          portion.onPortion();
          return;
      }
    },
  }


  const info = {
    text: () => {
      if (state.portion.length === 0) {
        return translate('empty-portion-info');
      }
      if (state.portionError) {
        return state.portionError;
      }
      const portion = mealPortionService.parse(
        state.portion,
        state.summary.total.grams,
      );
      const grams = portion * state.summary.total.grams;
      const calories = portion * state.summary.total.calories;
      return translate('portion-info', grams.toFixed(0), calories.toFixed(0));
    },

    isError: () => {
      return !!state.portionError;
    },
  };

  const infoClassNames = classNames(
    'mealz-meal-portion-info',
    { 'mealz-error': info.isError() },
  );

  return (
    <Modal
      className='mealz-meal-portion'
      show={props.show}
      backdrop={true}
      onHide={props.onClose}
      onEscapeKeyDown={props.onClose}
    >
      <div className='mealz-meal-portion-content'>
        <Form.Control
          ref={portion.ref}
          className='mealz-meal-portion-input'
          type='text'
          placeholder={translate('placeholder')}
          value={state.portion}
          onChange={portion.onChange}
          onKeyDown={portion.onKeyDown}
        />
        <div className={infoClassNames}>
          { info.text() }
        </div>
        <div className='mealz-meal-portion-button'>
          <LinkButton
            label={translate('portion')}
            onClick={portion.onPortion}
          />
        </div>        
      </div>
    </Modal>
  );
}