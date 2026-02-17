import * as React from 'react';
import classNames from 'classnames';

export interface SettingsButtonsProps {
  className?: string;
}

export function SettingsButtons(
  props: React.PropsWithChildren<SettingsButtonsProps>,
) {
  const className = classNames(
    'mealz-settings-buttons-container',
    props.className,
  );
  return (
    <div className={className}>
      <div className='mealz-settings-buttons'>
        { props.children }
      </div>
    </div>
  );
}