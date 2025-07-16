import * as React from 'react';
import classNames from 'classnames';
import { IngredientPicker, IngredientPickerProps } from './IngredientPicker';

interface IngredientPickerWrapperProps extends IngredientPickerProps {
  visible: boolean;
}

export function IngredientPickerWrapper(props: IngredientPickerWrapperProps) {
  const wrapperClassNames = classNames(
    'mealz-ingredient-picker-wrapper',
    { 'mealz-ingredient-picker-wrapper-hidden': !props.visible },
  );
  return (
    <div className={wrapperClassNames}>
      { props.visible &&
        <IngredientPicker
          ingredient={props.ingredient}
          onPickIngredient={props.onPickIngredient}
          onPickAdHocIngredient={props.onPickAdHocIngredient}
          onClose={props.onClose}
        />
      }
    </div>
  );
}