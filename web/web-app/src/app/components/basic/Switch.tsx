import * as React from 'react';
import classNames from 'classnames';

export interface SwitchProps {
  checked: boolean;
  width?: 'sm' | 'md' | 'lg';
  onChange: (checked: boolean) => void;
}

const WIDTH_MAP = {
  sm: '3rem',
  md: '5rem',
  lg: '7rem',
};

export function Switch(props: SwitchProps) {
  const switchStyle = {
    width: WIDTH_MAP[props.width ?? 'sm'],
  };

  const switchBarClasses = classNames(
    'mealz-switch-bar',
    { 'mealz-switch-bar-off': !props.checked },
    { 'mealz-switch-bar-on': props.checked },
  );
  const switchHandleClasses = classNames(
    'mealz-switch-handle',
    { 'mealz-switch-handle-off': !props.checked },
    { 'mealz-switch-handle-on': props.checked },
  );  

  return (
    <div
      className='mealz-switch'
      style={switchStyle}
      onClick={() => props.onChange(!props.checked)}
    >
      <div className={switchBarClasses}>
      </div>
      <div className={switchHandleClasses}>
      </div>
  </div>
  );
}