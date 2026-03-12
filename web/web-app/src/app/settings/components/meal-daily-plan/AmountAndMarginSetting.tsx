import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';

import { 
  blurRef,
  focusRef, 
  ifEnterKey, 
} from '../../../utils';
import { usePatchState } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import {
  AmountAndMarginSettingTranslations,
} from './AmountAndMarginSetting.translations';

export interface AmountAndMarginSettingProps {
  label: string;
  labelClassName: string;
  details: string;
  amount: string;
  invalidAmount: boolean;
  margin: string;
  invalidMargin: boolean;
  error?: string;
  onAmountChange: (amount: string) => void;
  onMarginChange: (margin: string) => void;
}

enum Focus { Amount, Margin };

interface AmountAndMarginSettingState {
  focus?: Focus;
}

export function AmountAndMarginSetting(
  props: AmountAndMarginSettingProps
) {
  const translate = useTranslations(AmountAndMarginSettingTranslations);

  const [state, setState] = useState<AmountAndMarginSettingState>({});
  const patchState = usePatchState(setState);

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Amount:
          focusRef(amount.ref, { select: true });
          break;
        case Focus.Margin:
          focusRef(margin.ref, { select: true });
          break;
      }
    },
    [state.focus],
  );

  const amount = {
    ref: useRef<HTMLInputElement>(null),

    onChange: (value: string) => {
      props.onAmountChange(value);
    },

    onFocus: () => {
      patchState({
        focus: Focus.Amount,
      });
    },

    onBlur: () => {
      patchState({
        focus: undefined,
      });
    },

    onEnter: () => {
      patchState({
        focus: Focus.Margin,
      });
    },
  }

  const margin = {
    ref: useRef<HTMLInputElement>(null),

    onChange: (value: string) => {
      props.onMarginChange(value);
    },

    onFocus: () => {
      patchState({
        focus: Focus.Margin,
      });
    },

    onBlur: () => {
      patchState({
        focus: undefined,
      });
    },

    onEnter: () => {
      blurRef(margin.ref);
    },
  }

  const labelClassName = classNames(
    'mealz-amount-and-margin-setting-label',
    props.labelClassName,
  );

  return (
    <div className='mealz-amount-and-margin-setting'>
      <div className={labelClassName}>
        { props.label }
        <span className='mealz-amount-and-margin-setting-details'>
          { props.details }
        </span>
      </div>
      <div className='mealz-amount-and-margin-setting-inputs'>
        <div className='mealz-amount-and-margin-setting-input'>
          <Form.Control
            ref={amount.ref}
            type='number'
            value={props.amount}
            onChange={(event) => amount.onChange(event.target.value)}
            onFocus={amount.onFocus}
            onBlur={amount.onBlur}
            onKeyDown={ifEnterKey(amount.onEnter)}
            isInvalid={props.invalidAmount}
          />
          <div className='mealz-amount-and-margin-setting-input-label'>
            { translate('amount') }
          </div>
        </div>
        <div className='mealz-amount-and-margin-setting-input'>
          <Form.Control
            ref={margin.ref}
            type='number'
            value={props.margin}
            onChange={(event) => margin.onChange(event.target.value)}
            onFocus={margin.onFocus}
            onBlur={margin.onBlur}
            onKeyDown={ifEnterKey(margin.onEnter)}
            isInvalid={props.invalidMargin}
          />
          <div className='mealz-amount-and-margin-setting-input-label'>
            { translate('margin') }
          </div>
        </div>
      </div>
      { props.error &&
        <div className='mealz-amount-and-margin-setting-error-label'>
          { props.error }
        </div>
      }
    </div>
  );
}