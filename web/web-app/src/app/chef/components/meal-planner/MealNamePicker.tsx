import * as React from 'react';
import Modal from 'react-bootstrap/Modal';

import { nameToKey } from '../../../utils';

export interface MealNamePickerProps {
  show: boolean
  mealNames: string[];
  onPick: (mealName: string) => void;
  onClose: () => void;
}

export function MealNamePicker(props: MealNamePickerProps) {
  const renderMealNames = () => {
    return props.mealNames.map((mealName) => {
      return (
        <div
          key={nameToKey(mealName)}
          className='mealz-meal-name-picker-meal-name'
          onClick={() => props.onPick(mealName)}
        >
          {mealName}
        </div>
      );
    });
  }

  return (
    <div>
      <Modal
        className='mealz-meal-name-picker'
        show={props.show}
        backdrop={true}
        centered={true}
        onHide={props.onClose}
        onEscapeKeyDown={props.onClose}
      >
        { renderMealNames() }
      </Modal>
    </div>
  );
}