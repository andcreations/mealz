import * as React from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { format } from 'timeago.js';
import { GWUpdatedAt } from '@mealz/backend-gateway-api';
import { GWNamedMeal } from '@mealz/backend-meals-named-gateway-api';

export interface NamedMealPickerDropdownProps {
  items: GWNamedMeal[];
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

  const renderItem = (item: GWNamedMeal & GWUpdatedAt, index: number) => {
    const selected = index === props.selectedIndex;
    const itemClassNames = classNames(
      'mealz-named-meal-picker-dropdown-item',
      { 'mealz-named-meal-picker-dropdown-item-selected': selected },
    );

    let info = '';
    const addInfo = (str: string) => {
      if (info) {
        info += ' · ';
      }
      info += str;
    }
    if (item.sharedBy) {
      addInfo(`Shared by ${item.sharedBy.firstName}`);
    }
    if (item.updatedAt) {
      addInfo(format(item.updatedAt));
    }

    return (
      <div
        id={`mealz-named-meal-picker-dropdown-item-${index}`}
        key={item.id}
        className={itemClassNames}
        onClick={() => props.onSelect(index)}
      >
        <div className='mealz-named-meal-picker-dropdown-item-name'>
          {item.name}
        </div>
        { info &&
          <div className='mealz-named-meal-picker-dropdown-item-info'>
            {info}
          </div>
        }
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