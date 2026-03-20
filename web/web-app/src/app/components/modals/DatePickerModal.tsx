import * as React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DateTime } from 'luxon';

import { useTranslations } from '../../i18n';
import { usePatchState, useService } from '../../hooks';
import { DateService, SystemService } from '../../system';
import { DatePicker, LinkButton } from '../basic';
import { DatePickerModalTranslations } from './DatePickerModal.translations';

export interface DatePickerModalProps {
  show: boolean;
  title?: string;
  details?: string;
  error?: string;
  day: number;
  month: number;
  year: number;
  onChange?: (day: number, month: number, year: number) => void;
  onEnter: (day: number, month: number, year: number) => void;
  onClose: () => void;
}

interface DatePickerModalState {
  day: number;
  month: number;
  year: number;
  valid: boolean;
}

export function DatePickerModal(props: DatePickerModalProps) {
  const systemService = useService(SystemService);
  const dateService = useService(DateService);
  const translate = useTranslations(DatePickerModalTranslations);

  const [state, setState] = useState<DatePickerModalState>({
    day: props.day,
    month: props.month,
    year: props.year,
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

      if (valid && props.onChange !== undefined) {
        props.onChange(day, month, year);
      }
    },

    onEnter: () => {
      if (!state.valid) {
        return;
      }
      props.onEnter(state.day, state.month, state.year);
    },

    onToday: () => {
      const today = dateService.getToday();
      patchState({
        day: today.day,
        month: today.month,
        year: today.year,
      });
    },

    onTomorrow: () => {
      const tomorrow = dateService.getTomorrow();
      patchState({
        day: tomorrow.day,
        month: tomorrow.month,
        year: tomorrow.year,
      });
    },
  }

  return (
    <Modal
      className='mealz-date-picker-modal'
      show={props.show}
      centered={!systemService.isMobile()}
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
          day={state.day}
          month={state.month}
          year={state.year}
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
        <div className='mealz-date-picker-modal-quick-buttons'>
          <LinkButton
            label={translate('today')}
            onClick={date.onToday}
          />
          <LinkButton
            label={translate('tomorrow')}
            onClick={date.onTomorrow}
          />
        </div>
      </div>
    </Modal>
  );
}
