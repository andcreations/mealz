import * as React from 'react';
import * as classNames from 'classnames';

export interface RowProps {
  alignment?: 'center';
  className?: string;
}

export function Row(props: React.PropsWithChildren<RowProps>) {
  const rowClassNames = classNames([
    'mealz-row',
    { 'mealz-row-center': props.alignment === 'center' },
    props.className,
  ])

  return (
    <div className={rowClassNames}>
      {props.children}
    </div>
  )
}