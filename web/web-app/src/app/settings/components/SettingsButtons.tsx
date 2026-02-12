import * as React from 'react';

export interface SettingsButtonsProps {
}

export function SettingsButtons(
  props: React.PropsWithChildren<SettingsButtonsProps>,
) {
  return (
    <div className='mealz-settings-buttons-container'>
      <div className='mealz-settings-buttons'>
        { props.children }
      </div>
    </div>
  );
}