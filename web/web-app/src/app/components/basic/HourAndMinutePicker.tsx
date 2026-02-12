import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import classNames = require('classnames');

import { usePatchState } from '../../hooks';
import { blurRef, focusRef, ifEnterKey } from '../../utils';

export interface HourAndMinutePickerProps {
  className?: string;
  hour: number;
  minute: number;
  onChange: (
    hour: number | undefined,
    minute: number | undefined,
    valid: boolean,
  ) => void;
  onEnter: () => void;
}

enum Focus { Hour, Minute };

interface HourAndMinutePickerState {
  focus: Focus;
  hour: string;
  hourError: boolean;
  minute: string;
  minuteError: boolean;
}

export function HourAndMinutePicker(props: HourAndMinutePickerProps) {
  const minutesToStr = (minutes: number | string) => {
    if (typeof minutes === 'number') {
      minutes = minutes.toString();
    }
    return minutes.padStart(2, '0');
  };

  const [state, setState] = useState<HourAndMinutePickerState>({
    focus: Focus.Hour,
    hour: props.hour.toString(),
    hourError: false,
    minute: minutesToStr(props.minute),
    minuteError: false,
  });
  const patchState = usePatchState(setState);

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Hour:
          focusRef(hour.ref, { select: true });
          break;
        case Focus.Minute:
          focusRef(minute.ref, { select: true });
          break;
      }
    },
    [state.focus],
  );
  useEffect(
    () => focusRef(hour.ref),
    [],
  );

  // notify
  useEffect(
    () => {
      if (state.hourError || state.minuteError) {
        props.onChange(undefined, undefined, false);
        return;
      }
      props.onChange(parseInt(state.hour), parseInt(state.minute), true);
    },
    [state.hour, state.minute, state.hourError, state.minuteError],
  );

  const pickerClassNames = classNames(
    'mealz-hour-and-minute-picker',
    props.className,
  );

  const hour = {
    ref: useRef<HTMLInputElement>(null),

    onFocus: () => {
      patchState({ focus: Focus.Hour });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      patchState({
        hour: value,
        hourError: !hour.isValid(value),
      });
    },

    onEnter: () => {
      if (state.hourError) {
        return;
      }

      blurRef(hour.ref);
      patchState({
        focus: Focus.Minute,
      });
    },

    isValid: (value: string) => {
      const hour = parseInt(value);
      return hour >= 0 && hour <= 23;
    },
  }

  const minute = {
    ref: useRef<HTMLInputElement>(null),

    onFocus: () => {
      patchState({ focus: Focus.Minute });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      patchState({
        minute: value,
        minuteError: !minute.isValid(value),
      });
    },

    onEnter: () => {
      if (state.minuteError) {
        return;
      }

      blurRef(minute.ref);
      if (!state.hourError && !state.minuteError) {
        props.onEnter();
      }
    },

    isValid: (value: string) => {
      const minute = parseInt(value);
      return minute >= 0 && minute <= 59;
    },
  }

  const hourInputClassNames = classNames(
    { 'mealz-input-error': state.hourError },
  );
  const minuteInputClassNames = classNames(
    { 'mealz-input-error': state.minuteError },
  );

  return (
    <div className={pickerClassNames}>
      <div className='mealz-hour-and-minute-picker-hour'>
        <div className='mealz-hour-and-minute-picker-hour-value'>
          <Form.Control
            className={hourInputClassNames}
            ref={hour.ref}
            type='number'
            min='0'
            max='23'
            value={state.hour}
            onFocus={hour.onFocus}
            onChange={hour.onChange}
            onKeyDown={ifEnterKey(hour.onEnter)}
          />
        </div>
      </div>
      <div className='mealz-hour-and-minute-picker-separator'>
        :
      </div>
      <div className='mealz-hour-and-minute-picker-minute'>
        <div className='mealz-hour-and-minute-picker-minute-value'>
          <Form.Control
            className={minuteInputClassNames}
            ref={minute.ref}
            type='number'
            min='0'
            max='59'
            value={state.minute}
            onFocus={minute.onFocus}
            onChange={minute.onChange}
            onKeyDown={ifEnterKey(minute.onEnter)}
          />
        </div>
      </div>
    </div>
  );
}