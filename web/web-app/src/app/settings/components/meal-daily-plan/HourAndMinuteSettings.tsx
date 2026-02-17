import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';

import { HourAndMinutePickerModal } from '../../../components';
import { usePatchState } from '../../../hooks';
import { Setting } from '../Setting';

export interface HourAndMinuteSettingsProps {
  pickerDetails?: string;
  pickerError?: string;
  hour: number;
  minute: number;
  error?: boolean;
  editable?: boolean;
  onChange?: (hour: number, minute: number) => void;
}

interface HourAndMinuteSettingsState {
  showPicker: boolean;
}

export function HourAndMinuteSettings(props: HourAndMinuteSettingsProps) {
  const [state, setState] = useState<HourAndMinuteSettingsState>({
    showPicker: false,
  });
  const patchState = usePatchState(setState);

  const onTimeClick = () => {
    if (!props.editable) {
      return;
    }
    patchState({ showPicker: true });
  };

  const onClosePicker = () => {
    patchState({ showPicker: false });
  };

  const onEnterTime = (hour: number, minute: number) => {
    if (props.onChange) {
      props.onChange(hour, minute);
    }
    onClosePicker();
  };

  const digits2 = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const timePartClassName = classNames(
    'mealz-hour-and-minute-settings-part',
    {
      'mealz-hour-and-minute-settings-time-editable': props.editable,
      'mealz-error': props.error,
    },
  );
  const hourPartClassName = classNames(
    'mealz-hour-and-minute-settings-hour-part',
    timePartClassName,
  );
  const minutePartClassName = classNames(
    'mealz-hour-and-minute-settings-minute-part',
    timePartClassName,
  );

  return (
    <>
      <div
        className='mealz-hour-and-minute-settings'
        onClick={onTimeClick}
      >
        <div className='mealz-hour-and-minute-settings-separator'/>
        <div
          className={hourPartClassName}
        >
          { digits2(props.hour) }
        </div>
        <div className='mealz-hour-and-minute-settings-separator-colon'>
          :
        </div>
        <div
          className={minutePartClassName}
        >
          { digits2(props.minute) }
        </div>
        <div className='mealz-hour-and-minute-settings-separator'/>
      </div>
      { state.showPicker &&
        <HourAndMinutePickerModal
          show={state.showPicker}
          details={props.pickerDetails}
          error={props.pickerError}
          hour={props.hour}
          minute={props.minute}
          onEnter={onEnterTime}
          onClose={onClosePicker}
        />
      }
    </>
  );
}
