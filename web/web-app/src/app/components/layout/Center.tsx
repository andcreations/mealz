import * as React from 'react';
import * as classNames from 'classnames';

export interface CenterProps {
  className?: string;
}

/** */
export function Center(props: React.PropsWithChildren<CenterProps>) {
  const centerClassNames = classNames([
    'mealz-center',
    props.className,
  ]);

  return (
    <div className={centerClassNames}>
      { props.children }
    </div>
  )
}