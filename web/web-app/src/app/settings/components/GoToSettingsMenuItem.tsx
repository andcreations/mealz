import * as React from 'react';
import { MaterialIcon } from '../../components';

export interface GoToSettingsMenuItemProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export function GoToSettingsMenuItem(props: GoToSettingsMenuItemProps) {
  return (
    <div
      className='mealz-go-to-settings-menu-item'
      onClick={props.onClick}
    >
      <MaterialIcon
        className='mealz-go-to-settings-menu-item-icon'
        icon={props.icon}
      />
      <div className='mealz-go-to-settings-menu-item-label'>
        { props.label }
      </div>
      <div className='mealz-go-to-settings-menu-item-arrow'>
        <MaterialIcon icon='arrow_forward_ios'/>
      </div>
    </div>
  );
}