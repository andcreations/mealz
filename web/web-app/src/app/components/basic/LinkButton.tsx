import * as React from 'react';

export interface LinkButtonProps {
  label: string;
  onClick: () => void;
}

export function LinkButton(props: LinkButtonProps) {
  return (
    <div
      className='mealz-link-button'
      onClick={props.onClick}
    >
      { props.label }
    </div>
  );
}