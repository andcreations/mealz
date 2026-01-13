import * as React from 'react';
import classNames from 'classnames';

export interface ProgressBarProps {
  value: number;
  max: number;
  backgroundClassName?: string;
  fillClassName?: string;
}

export function ProgressBar(props: ProgressBarProps) {
  const percent = Math.round((props.value / props.max) * 100);
  const fillWidth = `${Math.min(percent, 100)}%`;

  const backgroundClassName = classNames(
    'mealz-progress-bar',
    props.backgroundClassName,
  );
  const fillClassName = classNames(
    'mealz-progress-bar-fill',
    props.fillClassName,
  );
  return (
    <div className={backgroundClassName}>
      <div
        className={fillClassName}
        style={{ width: fillWidth }}
      >
      </div>
    </div>
  );
}