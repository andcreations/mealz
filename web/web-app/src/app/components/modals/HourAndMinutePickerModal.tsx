import * as React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useTranslations } from '../../i18n';
import { usePatchState } from '../../hooks';
import { HourAndMinutePicker } from '../basic';
import {
  HourAndMinutePickerModalTranslations,
} from './HourAndMinutePickerModal.translations';

export interface HourAndMinutePickerModalProps {
  show: boolean;
  title?: string;
  details?: string;
  error?: string;
  hour: number;
  minute: number;
  onEnter: (hour: number, minute: number) => void;
  onClose: () => void;
}

interface HourAndMinutePickerModalState {
  hour?: number;
  minute?: number;
  valid: boolean;
}

export function HourAndMinutePickerModal(props: HourAndMinutePickerModalProps) {
  const translate = useTranslations(HourAndMinutePickerModalTranslations);

  const [state, setState] = useState<HourAndMinutePickerModalState>({
    valid: true,
  });
  const patchState = usePatchState(setState);

  const time = {
    onChange: (
      hour: number | undefined,
      minute: number | undefined,
      valid: boolean,
    ) => {
      patchState({
        hour,
        minute,
        valid,
      });
    },

    onEnter: () => {
      if (!state.valid) {
        return;
      }
      props.onEnter(state.hour, state.minute);
    },
  }

  return (
    <Modal
      className='mealz-hour-and-minute-picker-modal'
      show={props.show}
      centered={true}
      backdrop={true}
      onHide={props.onClose}
      onEscapeKeyDown={props.onClose}      
    >
      <div className='mealz-hour-and-minute-picker-modal-content'>
        { !!props.title &&
          <div className='mealz-hour-and-minute-picker-modal-title'>
            { props.title }
          </div>
        }
        { !!props.details &&
          <div className='mealz-hour-and-minute-picker-modal-details'>
            { props.details }
          </div>
        }
        <HourAndMinutePicker
          className='mealz-hour-and-minute-picker-modal-picker'
          hour={props.hour}
          minute={props.minute}
          onChange={time.onChange}
          onEnter={time.onEnter}
        />
        { !!props.error &&
          <div className='mealz-hour-and-minute-picker-modal-error'>
            { props.error }
          </div>
        }
        <div className='mealz-hour-and-minute-picker-modal-buttons'>
          <Button
            size='sm'
            disabled={!state.valid}
            onClick={time.onEnter}
          >
            { translate('ok') }
          </Button>
        </div>
      </div>
    </Modal>
  );
}