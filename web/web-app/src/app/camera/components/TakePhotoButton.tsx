import * as React from 'react';
import classNames from 'classnames';

export interface TakePhotoButtonProps {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function TakePhotoButton(props: TakePhotoButtonProps) {
  const buttonClassNames = classNames(
    'mealz-take-photo-button',
    props.className,
  );

  return (
    <button
      className={buttonClassNames}
      type='button'
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span className='mealz-take-photo-button-inner'/>
    </button>
  );
}