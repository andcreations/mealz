import * as React from 'react';
import { MouseEventHandler, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';

import { usePatchState } from '../../hooks';

export interface MaterialIconProps {
  icon: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<unknown>;
}

interface MaterialIconState {
  isClicked: boolean;
}

export function MaterialIcon(props: MaterialIconProps) {
  const [state, setState] = useState<MaterialIconState>({
    isClicked: false,
  });
  const patchState = usePatchState(setState);

  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const clickTimerDelay = 300;

  useEffect(() => {
    if (state.isClicked) {
      clickTimer.current = setTimeout(() => {
        patchState({ isClicked: false });
      }, clickTimerDelay);
    }
    return () => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
    }
  }, [state.isClicked]);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (props.disabled) {
      return;
    }
    patchState({ isClicked: true });
    props.onClick(event);
  };

  const iconClassNames = classNames([
    'mealz-material-icon',
    { 'mealz-material-icon-disabled': props.disabled },
    { 'mealz-material-icon-clicked': state.isClicked },
    props.className,
  ]);

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