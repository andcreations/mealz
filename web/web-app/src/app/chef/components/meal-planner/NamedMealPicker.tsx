import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { usePatchState, useService } from '../../../hooks';
import { focusRef, Key, mapKey, stopBubble } from '../../../utils';
import { LinkButton } from '../../../components';
import { MealsNamedService } from '../../../meals/';
import { NamedMealPickerDropdown } from './NamedMealPickerDropdown';

enum Focus { Name };

const SEARCH_LIMIT = 8;

export interface NamedMealPickerProps {
  show: boolean;
  buttonLabel: string;
  placeholder: string;
  info?: {
    empty?: string;
    matching?: string;
    nonMatching?: string;
  }
  mustMatchToPick?: boolean;
  onPick: (name: string) => void;
  onClose: () => void;
}

interface NamedMealPickerState {
  focus: Focus;
  name: string;
  dropdownItems: string[];
  dropdownIndex: number;
  dropdownVisible: boolean;
}

export function NamedMealPicker(props: NamedMealPickerProps) {
  const mealsNamedService = useService(MealsNamedService);
  
  const [state, setState] = useState<NamedMealPickerState>({
    focus: Focus.Name,
    name: '',
    dropdownItems: [],
    dropdownIndex: 0,
    dropdownVisible: true,
  });
  const patchState = usePatchState(setState);

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Name:
          focusRef(name.ref, { select: true });
          break;
      }
    },
    [state.focus],
  );

  const name = {
    ref: useRef(null),

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;  
      patchState({
        name,
        dropdownItems: dropdown.matchItems(name),
        dropdownIndex: 0,
        dropdownVisible: true,
      });
    },

    onSelectFromDropdown: (index: number) => {
      patchState({
        name: dropdown.items()[index],
        dropdownVisible: false,
      });
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (mapKey(event)) {
        case Key.Enter:
          stopBubble(event);
          name.onSelectFromDropdown(state.dropdownIndex);
          return;
        case Key.ArrowDown:
          stopBubble(event);
          const length = dropdown.items().length;
          patchState({
            dropdownIndex: Math.min(state.dropdownIndex + 1, length - 1)
          });
          return;
        case Key.ArrowUp:
          stopBubble(event);
          patchState({
            dropdownIndex: Math.max(state.dropdownIndex - 1, 0),
          });
          return;          
      }
    },

    onPick: () => {
      if (
        props.mustMatchToPick &&
        !mealsNamedService.hasByName(state.name)
      ) {
        return;
      }
      props.onPick(state.name);
    }
  }

  const dropdown = {
    matchItems: (name: string) => {
      return mealsNamedService
        .search(name, SEARCH_LIMIT)
        .map(meal => meal.name);
    },

    items: () => {
      return state.dropdownItems;
    },

    visible: () => {
      return (
        state.dropdownVisible &&
        state.name.length > 0 &&
        state.dropdownItems.length > 0
      );
    },
  }

  const info = {
    visible: () => {
      return state.name.length > 0;
    },

    text: () => {
      if (state.name.length === 0) {
        return props.info?.empty ?? '';
      }
      return mealsNamedService.hasByName(state.name)
        ? props.info?.matching ?? ''
        : props.info?.nonMatching ?? '';
    },
  }

  const button = {
    disabled: () => {
      if (
        props.mustMatchToPick &&
        !mealsNamedService.hasByName(state.name)
      ) {
        return true;
      }
      if (state.name.length === 0) {
        return true;
      }
      return false;
    },
  }

  return (
    <Modal
      className='mealz-named-meal-picker'
      show={props.show}
      backdrop={true}
      onHide={props.onClose}
      onEscapeKeyDown={props.onClose}
    >
      <div className='mealz-named-meal-picker-content'>
        <div className='mealz-named-meal-picker-name'>
          <Form.Control
            ref={name.ref}
            className='mealz-named-meal-picker-name-input'
            type='text'
            placeholder={props.placeholder}
            value={state.name}
            onChange={name.onChange}
            onKeyDown={name.onKeyDown}
          />
          { info.visible() &&
            <div className='mealz-named-meal-picker-info'>
              { info.text() }
            </div>
          }
        </div>
        { dropdown.visible() &&
          <NamedMealPickerDropdown
            items={dropdown.items()}
            selectedIndex={state.dropdownIndex}
            onSelect={name.onSelectFromDropdown}
          />
        }
        <div className='mealz-named-meal-picker-button'>
          <LinkButton
            label={props.buttonLabel}
            size='small'
            onClick={name.onPick}
          />
        </div>
      </div>
    </Modal>
  );
}