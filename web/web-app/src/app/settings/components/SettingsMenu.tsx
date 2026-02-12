import * as React from 'react';

export interface SettingsMenuProps {
}

export function SettingsMenu(
  props: React.PropsWithChildren<SettingsMenuProps>
) {
  return (
    <div className='mealz-settings-menu'>
      { props.children }
    </div>
  );
}