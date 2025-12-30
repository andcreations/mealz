import * as React from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';

import { labelToId } from '../../../utils';

export interface NamedMealPickerDropdownProps {
  items: string[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

export function NamedMealPickerDropdown(props: NamedMealPickerDropdownProps) {
  useEffect(() => {
    if (props.selectedIndex === undefined) {
      return;
    }
    const selectedElement = document.getElementById(
      `mealz-named-meal-picker-dropdown-item-${props.selectedIndex}`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  });

  const renderItem = (item: string, index: number) => {
    const selected = index === props.selectedIndex;
    const itemClassNames = classNames(
      'mealz-named-meal-picker-dropdown-item',
      { 'mealz-named-meal-picker-dropdown-item-selected': selected },
    );

    return (
      <div
        id={`mealz-named-meal-picker-dropdown-item-${index}`}
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