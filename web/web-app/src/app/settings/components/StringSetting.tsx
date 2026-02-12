import * as React from 'react';
import classNames from 'classnames';

import { Setting } from './Setting';

export interface LabelSettingProps {
  label: string;
  details?: string;
  value: string;
  error?: boolean;
  onValueClick?: () => void;
}

export function LabelSetting(props: LabelSettingProps) {
  const valueClassNames = classNames(
    'mealz-label-setting-value',
    { 'mealz-error': props.error },
  );

  return (
    <Setting
      label={props.label}
      details={props.details}
    >
      <div 
        className={valueClassNames}
        onClick={props.onValueClick}
      >
        { props.value }
      </div>
    </Setting>
  );
}