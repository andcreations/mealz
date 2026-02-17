import * as React from 'react';
import classNames from 'classnames';

export interface SettingsSeparatorProps {
  size?: 'small' | 'full';
}

export function SettingsSeparator(props: SettingsSeparatorProps) {
  const className = classNames(
    'mealz-settings-separator',
    {
      'mealz-settings-separator-small': props.size === 'small',
    },
  );
  return (
    <div className={className}/>
  );
}