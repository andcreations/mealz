import * as React from 'react';
import classNames from 'classnames';

import { Setting } from './Setting';

export interface LabelSettingProps {
  label: string;
  labelSuffix?: string;
  details?: string;
  value: string;
  valueError?: boolean;
  valueClassName?: string;
  onValueClick?: () => void;
}

export function LabelSetting(props: LabelSettingProps) {
  const valueClassNames = classNames(
    'mealz-label-setting-value',
    { 'mealz-error': props.valueError },
    props.valueClassName,
  );

  return (
    <Setting
      label={props.label}
      labelSuffix={props.labelSuffix}
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