import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Form from 'react-bootstrap/Form';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import { usePatchState, useService } from '../../hooks';
import { blurRef, focusRef, ifEnterKey } from '../../utils';
import { useTranslations } from '../../i18n';
import { DateService } from '../../system';
import { DatePickerTranslations } from './DatePicker.translations';

export interface DatePickerProps {
  className?: string;
  day: number | undefined;
  month: number | undefined;
  year: number | undefined;
  error?: string;
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
  dayError: boolean;
  monthError: boolean;
  yearError: boolean;
}

export function DatePicker(props: DatePickerProps) {
  const dateService = useService(DateService);
  const translate = useTranslations(DatePickerTranslations);

  const digits = (value: number | string | undefined, count: number) => {
    if (value === undefined) {
      return '';
    }
    if (typeof value === 'number') {
      value = value.toString();
    }
    return value;
  };

  const [state, setState] = useState<DatePickerState>({
    focus: Focus.Day,
    dayError: false,
    monthError: false,
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

  // update the error state
  useEffect(
    () => {
      const dayError = !day.isValid(props.day.toString());
      const monthError = !month.isValid(props.month.toString());
      const yearError = !year.isValid(props.year.toString());
      patchState({ dayError, monthError, yearError });

      if (props.onChange !== undefined) {
        const isValid = !dayError && !monthError && !yearError;
        props.onChange(props.day, props.month, props.year, isValid);
      }
    },
    [props.day, props.month, props.year],
  );

  const day = {
    ref: useRef<HTMLInputElement>(null),

    onFocus: () => {
      patchState({ focus: Focus.Day });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const isValid = day.isValid(value);
      patchState({ dayError: !isValid });
      props.onChange(parseInt(value), props.month, props.year, isValid);
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
      const isValid = month.isValid(value);
      patchState({ monthError: !isValid });
      props.onChange(props.day, parseInt(value), props.year, isValid);
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
      const isValid = year.isValid(value);
      patchState({ yearError: !isValid });
      props.onChange(props.day, props.month, parseInt(value), isValid);
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

  const dateSummary = useMemo(
    () => {
      if (state.dayError || state.monthError || state.yearError) {
        return undefined;
      }
      const day = props.day;
      const month = props.month;
      const year = props.year;
      const date = DateTime.local(year, month, day);
      if (!date.isValid) {
        return undefined;
      }

      const dayOfWeek = date.toFormat('EEEE');
      const differenceInDays = dateService.differenceInDaysFromNow(date);

      let relative: string;
      if (differenceInDays === 0) {
        relative = translate('today');
      }
      else if (differenceInDays === 1) {
        relative = translate('tomorrow');
      }
      else if (differenceInDays > 1) {
        relative = translate('in-days', differenceInDays.toString());
      }
      else if (differenceInDays < 0) {
        relative = translate('days-ago', (-differenceInDays).toString());
      }

      return translate('summary', dayOfWeek, relative);
    },
    [
      props.day,
      props.month,
      props.year,
      state.dayError,
      state.monthError,
      state.yearError,
    ],
  );

  const pickerClassNames = classNames(
    'mealz-date-picker',
    props.className,
  );
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
      <div className='mealz-date-picker-inputs'>
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
              value={digits(props.day, 2)}
              onFocus={day.onFocus}
              onChange={day.onChange}
              onKeyDown={ifEnterKey(day.onEnter)}
              enterKeyHint='done'
            />
          </div>
          <div className='mealz-date-picker-label'>{ translate('day') }</div>
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
              value={digits(props.month, 2)}
              onFocus={month.onFocus}
              onChange={month.onChange}
              onKeyDown={ifEnterKey(month.onEnter)}
              enterKeyHint='done'
            />
          </div>
          <div className='mealz-date-picker-label'>{ translate('month') }</div>
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
              value={digits(props.year, 4)}
              onFocus={year.onFocus}
              onChange={year.onChange}
              onKeyDown={ifEnterKey(year.onEnter)}
              enterKeyHint='done'
            />
          </div>
          <div className='mealz-date-picker-label'>{ translate('year') }</div>
        </div>
      </div>
      { props.error !== undefined &&
        <div className='mealz-date-picker-error'>
          { props.error }
        </div>
      }
      { (props.error === undefined && !!dateSummary) &&
        <div className='mealz-date-picker-summary'>
          { dateSummary }
        </div>
      }
    </div>
  );
}