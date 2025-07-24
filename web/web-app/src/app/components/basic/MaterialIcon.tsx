import * as React from 'react';
import { MouseEventHandler } from 'react';
import classNames from 'classnames';

export interface MaterialIconProps {
  icon: string;
  title?: string;
  className?: string;
  onClick?: MouseEventHandler<unknown>;
}

/** */
export function MaterialIcon(props: MaterialIconProps) {
  const iconClassNames = classNames([
    'mealz-material-icon',
    props.className,
  ]);

  return (
    <i
      className={iconClassNames}
      title={props.title}
      onClick={props.onClick}
    >
      {props.icon}
    </i>
  );
}