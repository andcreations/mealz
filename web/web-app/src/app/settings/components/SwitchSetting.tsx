import * as React from 'react';

import { Switch } from '../../components';
import { Setting } from './Setting';

export interface SwitchSettingProps {
  label: string;
  details?: string;
  checked: boolean;
  disabled?: boolean;
  width?: 'sm' | 'md' | 'lg';
  onChange: (checked: boolean) => void;
}

export function SwitchSetting(props: SwitchSettingProps) {
  return (
    <Setting
      label={props.label}
      details={props.details}
    >
      <Switch
        checked={props.checked}
        disabled={props.disabled}
        width={props.width}
        onChange={props.onChange}
      />
    </Setting>
  );
}