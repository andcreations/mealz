import * as React from 'react';
import * as classNames from 'classnames';

import { labelToId, stopBubble } from '../../utils';

export interface PageNavbarMenuItem {
  label: string;
  onClick: () => void;
}

export interface PageNavbarMenuProps {
  className?: string;
  hidden: boolean;
  items: PageNavbarMenuItem[];
  onItemClick: () => void;
  onCancel: () => void;
}

export function PageNavbarMenu(props: PageNavbarMenuProps) {
  const menuClassNames = classNames([
    'mealz-page-navbar-menu',
    props.className,
    { 'mealz-page-navbar-menu-hidden': props.hidden },
  ]);

  const onOverlayClick = (event: React.MouseEvent) => {
    stopBubble(event);
    props.onCancel();
  };
  
  const onItemClick = (event: React.MouseEvent, item: PageNavbarMenuItem) => {
    stopBubble(event);
    props.onItemClick();
    item.onClick();
  };

  const renderItems = () => {
    return props.items.map(item => {
      return (
        <div
          key={labelToId(item.label)}
          className='mealz-page-navbar-menu-item'
          onClick={(event) => onItemClick(event, item)}
        >
          { item.label }
        </div>
      );
    })
  }

  return (
    <>
      <div className={menuClassNames}>
        { renderItems() }
      </div>
      { !props.hidden &&
        <div
          className='mealz-page-navbar-menu-overlay'
          onClick={onOverlayClick}
        >
        </div>      
      }
    </>
  );
}