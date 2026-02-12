import * as React from 'react';
import Form from 'react-bootstrap/Form';
import classNames = require('classnames');

import { Setting } from './Setting';

export interface InputSettingProps {
  className?: string;
  type: 'text' | 'number';
  label: string;
  details?: string;
  value: string | number;
  error?: boolean;
  width?: 'sm' | 'md' | 'lg';
  onChange: (value: string | number) => void;
}

const WIDTH_MAP = {
  sm: '2rem',
  md: '4rem',
  lg: '6rem',
};

export function InputSetting(props: InputSettingProps) {
  const inputStyle = {
    width: WIDTH_MAP[props.width ?? 'md'],
  };

  const inputClassName = classNames(
    props.className,
    { 'mealz-input-error': props.error },
  );

  return (
    <Setting
      label={props.label}
      details={props.details}
    >
      <Form.Control
        className={inputClassName}
        style={inputStyle}
        type={props.type}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </Setting>
  );
}