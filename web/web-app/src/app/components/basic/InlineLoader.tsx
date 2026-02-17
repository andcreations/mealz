import * as React from 'react';
import classNames from 'classnames';

export interface InlineLoaderProps {
  className?: string;
  small?: boolean;
}

export function InlineLoader(props: InlineLoaderProps) {
  const { className, small = false } = props;
  const spinnerClassNames = classNames(
    className,
    { 'mealz-spinner': !small },
    { 'mealz-spinner-small': small },
  );
  return (
    <div className={spinnerClassNames}>
      <div className='bounce-a'></div>
      <div className='bounce-b'></div>
      <div className='bounce-c'></div>
    </div>
  );
}

