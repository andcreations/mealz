import * as React from 'react';
import classNames from 'classnames';

import { labelToId } from '../../../utils';

export interface NamedMealPickerDropdownProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function NamedMealPickerDropdown(props: NamedMealPickerDropdownProps) {
  const renderItem = (item: string, index: number) => {
    const selected = index === props.selectedIndex;
    const itemClassNames = classNames(
      'mealz-named-meal-picker-dropdown-item',
      { 'mealz-named-meal-picker-dropdown-item-selected': selected },
    );

    return (
      <div
        key={labelToId(item)}
        className={itemClassNames}
        onClick={() => props.onSelect(index)}
      >
        {item}
      </div>
    );
  }

  const renderItems = () => {
    return props.items.map(renderItem);
  }

  return (
    <>
      { props.items.length > 0 &&
        <div className='mealz-named-meal-picker-dropdown'>
          {renderItems()}
        </div>
      }
    </>
  );
}