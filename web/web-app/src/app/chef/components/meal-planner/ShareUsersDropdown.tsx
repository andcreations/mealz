import * as React from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { GWShareUser } from '@mealz/backend-meals-named-gateway-api';

export interface ShareUsersDropdownProps {
  items: GWShareUser[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

export function ShareUsersDropdown(props: ShareUsersDropdownProps) {
  useEffect(() => {
    if (props.selectedIndex === undefined) {
      return;
    }
    const selectedElement = document.getElementById(
      `mealz-share-users-dropdown-item-${props.selectedIndex}`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  });

  const renderItem = (item: GWShareUser, index: number) => {
    const selected = index === props.selectedIndex;
    const itemClassNames = classNames(
      'mealz-share-users-dropdown-item',
      { 'mealz-share-users-dropdown-item-selected': selected },
    );

    return (
      <div
        id={`mealz-share-users-dropdown-item-${index}`}
        key={item.id}
        className={itemClassNames}
        onClick={() => props.onSelect(index)}
      >
        <div className='mealz-share-users-dropdown-item-name'>
          {item.firstName}
        </div>
      </div>
    );
  }

  const renderItems = () => {
    return props.items.map(renderItem);
  }

  return (
    <>
      { props.items.length > 0 &&
        <div className='mealz-share-users-dropdown'>
          {renderItems()}
        </div>
      }
    </>
  );
}
