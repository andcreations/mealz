import * as React from 'react';
import { MouseEventHandler } from 'react';
import classNames from 'classnames';

export interface MaterialIconProps {
  icon: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<unknown>;
}

/** */
export function MaterialIcon(props: MaterialIconProps) {
  const iconClassNames = classNames([
    'mealz-material-icon',
    { 'mealz-material-icon-disabled': props.disabled },
    props.className,
  ]);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (props.disabled) {
      return;
    }
    props.onClick(event);
  };

  return (
    <i
      className={iconClassNames}
      title={props.title}
      onClick={onClick}
    >
      {props.icon}
    </i>
  );
}