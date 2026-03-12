import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import classNames from 'classnames';

import { usePatchState } from '../../hooks';
import { blurRef, focusRef, ifEnterKey } from '../../utils';

export interface DatePickerProps {
  className?: string;
  day: number;
  month: number;
  year: number;
  onChange: (
    day: number | undefined,
    month: number | undefined,
    year: number | undefined,
    valid: boolean,
  ) => void;
  onEnter: () => void;
}

enum Focus { Day, Month, Year };

interface DatePickerState {
  focus: Focus;
  day: string;
  dayError: boolean;
  month: string;
  monthError: boolean;
  year: string;
  yearError: boolean;
}

export function DatePicker(props: DatePickerProps) {
  const digits2 = (value: number | string) => {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return value.padStart(2, '0');
  };

  const [state, setState] = useState<DatePickerState>({
    focus: Focus.Day,
    day: digits2(props.day),
    dayError: false,
    month: digits2(props.month),
    monthError: false,
    year: props.year.toString(),
    yearError: false,
  });
  const patchState = usePatchState(setState);

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Day:
          focusRef(day.ref, { select: true });
          break;
        case Focus.Month:
          focusRef(month.ref, { select: true });
          break;
        case Focus.Year:
          focusRef(year.ref, { select: true });
          break;
      }
    },
    [state.focus],
  );
  useEffect(
    () => focusRef(day.ref),
    [],
  );

  // notify
  useEffect(
    () => {
      if (state.dayError || state.monthError || state.yearError) {
        props.onChange(undefined, undefined, undefined, false);
        return;
      }
      props.onChange(
        parseInt(state.day),
        parseInt(state.month),
        parseInt(state.year),
        true,
      );
    },
    [
      state.day,
      state.month,
      state.year,
      state.dayError,
      state.monthError,
      state.yearError,
    ],
  );

  const pickerClassNames = classNames(
    'mealz-date-picker',
    props.className,
  );

  const day = {
    ref: useRef<HTMLInputElement>(null),

    onFocus: () => {
      patchState({ focus: Focus.Day });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      patchState({
        day: value,
        dayError: !day.isValid(value),
      });
    },

    onEnter: () => {
      if (state.dayError) {
        return;
      }

      blurRef(day.ref);
      patchState({
        focus: Focus.Month,
      });
    },

    isValid: (value: string) => {
      const day = parseInt(value);
      return day >= 1 && day <= 31;
    },
  };

  const month = {
    ref: useRef<HTMLInputElement>(null),

    onFocus: () => {
      patchState({ focus: Focus.Month });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      patchState({
        month: value,
        monthError: !month.isValid(value),
      });
    },

    onEnter: () => {
      if (state.monthError) {
        return;
      }

      blurRef(month.ref);
      patchState({
        focus: Focus.Year,
      });
    },

    isValid: (value: string) => {
      const month = parseInt(value);
      return month >= 1 && month <= 12;
    },
  };

  const year = {
    ref: useRef<HTMLInputElement>(null),

    onFocus: () => {
      patchState({ focus: Focus.Year });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      patchState({
        year: value,
        yearError: !year.isValid(value),
      });
    },

    onEnter: () => {
      if (state.yearError) {
        return;
      }

      blurRef(year.ref);
      if (!state.dayError && !state.monthError && !state.yearError) {
        props.onEnter();
      }
    },

    isValid: (value: string) => {
      const year = parseInt(value);
      return year >= 1900 && year <= 9999;
    },
  };

  const dayInputClassNames = classNames(
    { 'mealz-input-error': state.dayError },
  );
  const monthInputClassNames = classNames(
    { 'mealz-input-error': state.monthError },
  );
  const yearInputClassNames = classNames(
    { 'mealz-input-error': state.yearError },
  );

  return (
    <div className={pickerClassNames}>
      <div className='mealz-date-picker-day'>
        <div className='mealz-date-picker-day-value'>
          <Form.Control
            className={dayInputClassNames}
            ref={day.ref}
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            min='1'
            max='31'
            value={state.day}
            onFocus={day.onFocus}
            onChange={day.onChange}
            onKeyDown={ifEnterKey(day.onEnter)}
            enterKeyHint='done'
          />
        </div>
      </div>
      <div className='mealz-date-picker-separator'>
      </div>
      <div className='mealz-date-picker-month'>
        <div className='mealz-date-picker-month-value'>
          <Form.Control
            className={monthInputClassNames}
            ref={month.ref}
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            min='1'
            max='12'
            value={state.month}
            onFocus={month.onFocus}
            onChange={month.onChange}
            onKeyDown={ifEnterKey(month.onEnter)}
            enterKeyHint='done'
          />
        </div>
      </div>
      <div className='mealz-date-picker-separator'>
      </div>
      <div className='mealz-date-picker-year'>
        <div className='mealz-date-picker-year-value'>
          <Form.Control
            className={yearInputClassNames}
            ref={year.ref}
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            min='1900'
            max='9999'
            value={state.year}
            onFocus={year.onFocus}
            onChange={year.onChange}
            onKeyDown={ifEnterKey(year.onEnter)}
            enterKeyHint='done'
          />
        </div>
      </div>
    </div>
  );
}