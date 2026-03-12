import * as React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useTranslations } from '../../i18n';
import { usePatchState } from '../../hooks';
import { DatePicker } from '../basic';
import { DatePickerModalTranslations } from './DatePickerModal.translations';

export interface DatePickerModalProps {
  show: boolean;
  title?: string;
  details?: string;
  error?: string;
  day: number;
  month: number;
  year: number;
  onEnter: (day: number, month: number, year: number) => void;
  onClose: () => void;
}

interface DatePickerModalState {
  day?: number;
  month?: number;
  year?: number;
  valid: boolean;
}

export function DatePickerModal(props: DatePickerModalProps) {
  const translate = useTranslations(DatePickerModalTranslations);

  const [state, setState] = useState<DatePickerModalState>({
    valid: true,
  });
  const patchState = usePatchState(setState);

  const date = {
    onChange: (
      day: number | undefined,
      month: number | undefined,
      year: number | undefined,
      valid: boolean,
    ) => {
      patchState({
        day,
        month,
        year,
        valid,
      });
    },

    onEnter: () => {
      if (!state.valid) {
        return;
      }
      props.onEnter(state.day, state.month, state.year);
    },
  }

  return (
    <Modal
      className='mealz-date-picker-modal'
      show={props.show}
      centered={true}
      backdrop={true}
      onHide={props.onClose}
      onEscapeKeyDown={props.onClose}      
    >
      <div className='mealz-date-picker-modal-content'>
        { !!props.title &&
          <div className='mealz-date-picker-modal-title'>
            { props.title }
          </div>
        }
        { !!props.details &&
          <div className='mealz-date-picker-modal-details'>
            { props.details }
          </div>
        }
        <DatePicker
          className='mealz-date-picker-modal-picker'
          day={props.day}
          month={props.month}
          year={props.year}
          onChange={date.onChange}
          onEnter={date.onEnter}
        />
        { !!props.error &&
          <div className='mealz-date-picker-modal-error'>
            { props.error }
          </div>
        }
        <div className='mealz-date-picker-modal-buttons'>
          <Button
            size='sm'
            disabled={!state.valid}
            onClick={date.onEnter}
          >
            { translate('ok') }
          </Button>
        </div>
      </div>
    </Modal>
  );
}
