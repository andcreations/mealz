import * as React from 'react';
import classNames from 'classnames';

export interface LinkButtonProps {
  className?: string;
  size?: 'small' | 'normal';
  label: string;
  onClick: () => void;
}

export function LinkButton(props: LinkButtonProps) {
  const linkButtonClassNames = classNames(
    'mealz-link-button',
    props.className,
    { 'mealz-link-button-small': props.size === 'small' },
  );
  return (
    <div
      className={linkButtonClassNames}
      onClick={props.onClick}
    >
      { props.label }
    </div>
  );
}