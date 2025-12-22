import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { focusRef } from '../../../utils';
import { MealPortionTranslations } from './MealPortion.translations';
import { MealPortionService } from '../../services';
import classNames = require('classnames');

enum Focus { Portion };

export interface MealPortionProps {
  mealWeightInGrams: number;
  show: boolean;
  onClose: () => void;
}

interface MealPortionState {
  focus: Focus;
  portion: string;
  portionError?: string;
}

export function MealPortion(props: MealPortionProps) {
  const mealPortionService = useService(MealPortionService);

  const [state, setState] = useState<MealPortionState>({
    focus: Focus.Portion,
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
      patchState({ portion: event.target.value });
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      // TODO
    },
  }


  const info = {
    text: () => {
      if (state.portion.length === 0) {
        return translate('empty-portion-info');
      }
      return 'Info goes here';
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
    </Modal>
  );
}