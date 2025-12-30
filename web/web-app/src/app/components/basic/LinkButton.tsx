import * as React from 'react';
import classNames from 'classnames';

export interface LinkButtonProps {
  className?: string;
  size?: 'small' | 'normal';
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export function LinkButton(props: LinkButtonProps) {
  const onClick = () => {
    if (props.disabled) {
      return;
    }
    props.onClick();
  };

  const linkButtonClassNames = classNames(
    'mealz-link-button',
    props.className,
    { 'mealz-link-button-small': props.size === 'small' },
    { 'mealz-link-button-disabled': props.disabled },
  );
  return (
    <div
      className={linkButtonClassNames}
      onClick={onClick}
    >
      { props.label }
    </div>
  );
}