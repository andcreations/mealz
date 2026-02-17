import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';

import { 
  blurRef,
  focusRef, 
  ifEnterKey, 
  parsePositiveInteger, 
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
  amount: number;
  margin: number;
  onChange: (amount: number, margin: number) => void;
}

enum Focus { Amount, Margin };

interface AmountAndMarginSettingState {
  focus?: Focus;
  amount: string;
  amountError: boolean;
  margin: string;
  marginError: boolean;
  error?: string;
}

export function AmountAndMarginSetting(
  props: AmountAndMarginSettingProps
) {
  const translate = useTranslations(AmountAndMarginSettingTranslations);

  const [state, setState] = useState<AmountAndMarginSettingState>({
    amount: props.amount.toString(),
    amountError: false,
    margin: props.margin.toString(),
    marginError: false,
  });
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

  const notifyChange = () => {
    if (state.amountError || state.marginError) {
      return;
    }
    props.onChange(
      parseInt(state.amount),
      parseInt(state.margin),
    );
  }

  const amount = {
    ref: useRef<HTMLInputElement>(null),

    onChange: (valueStr: string) => {
      if (amount.checkError(valueStr)) {
        return;
      }
      patchState({
        amount: valueStr,
        amountError: false,
        error: undefined,
      });
      notifyChange();
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
      notifyChange();
    },

    onEnter: () => {
      patchState({
        focus: Focus.Margin,
      });
      notifyChange();
    },

    checkError: (valueStr: string): boolean => {
      const amount = parsePositiveInteger(valueStr);
      if (isNaN(amount) || amount <= 0 || state.marginError === true) {
        patchState({
          amount: valueStr,
          amountError: true,
          error: undefined,
        });
        return true;
      }
      const margin = parseInt(state.margin);
      if (amount - margin <= 0) {
        patchState({
          amount: valueStr,
          amountError: true,
          error: translate('margin-must-be-less-than-amount'),
        });
        return true;
      }
      return false;
    }
  }

  const margin = {
    ref: useRef<HTMLInputElement>(null),

    onChange: (valueStr: string) => {
      if (margin.checkError(valueStr)) {
        return;
      }
      patchState({
        margin: valueStr,
        marginError: false,
      });
      notifyChange();
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
      notifyChange();
    },

    onEnter: () => {
      blurRef(margin.ref);
      notifyChange();
    },

    checkError: (valueStr: string): boolean => {
      const margin = parsePositiveInteger(valueStr);
      if (isNaN(margin) || margin < 0 || state.amountError === true) {
        patchState({
          margin: valueStr,
          marginError: true,
          error: undefined,
        });
        return true;
      }
      const amount = parseInt(state.amount);
      if (amount - margin <= 0) {
        patchState({
          margin: valueStr,
          marginError: true,
          error: translate('margin-must-be-less-than-amount'),
        });
        return true;
      }
      return false;
    }
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
            value={state.amount}
            onChange={(event) => amount.onChange(event.target.value)}
            onFocus={amount.onFocus}
            onBlur={amount.onBlur}
            onKeyDown={ifEnterKey(amount.onEnter)}
            isInvalid={state.amountError}
          />
          <div className='mealz-amount-and-margin-setting-input-label'>
            { translate('amount') }
          </div>
        </div>
        <div className='mealz-amount-and-margin-setting-input'>
          <Form.Control
            ref={margin.ref}
            type='number'
            value={state.margin}
            onChange={(event) => margin.onChange(event.target.value)}
            onFocus={margin.onFocus}
            onBlur={margin.onBlur}
            onKeyDown={ifEnterKey(margin.onEnter)}
            isInvalid={state.marginError}
          />
          <div className='mealz-amount-and-margin-setting-input-label'>
            { translate('margin') }
          </div>
        </div>
      </div>
      { state.error &&
        <div className='mealz-amount-and-margin-setting-error-label'>
          { state.error }
        </div>
      }
    </div>
  );
}