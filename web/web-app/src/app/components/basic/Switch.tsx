import * as React from 'react';
import classNames from 'classnames';

export interface SwitchProps {
  checked: boolean;
  size?: 'sm' | 'md';
  width?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const WIDTH_MAP = {
  xs: '2rem',
  sm: '3rem',
  md: '5rem',
  lg: '7rem',
};

export function Switch(props: SwitchProps) {
  const { size = 'md' } = props;
  const switchStyle = {
    width: WIDTH_MAP[props.width ?? 'sm'],
  };

  const switchClasses = classNames(
    { 'mealz-switch-sm': size === 'sm' },
    { 'mealz-switch-md': size === 'md' },
  );
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
      className={switchClasses}
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